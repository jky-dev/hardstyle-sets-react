import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { database } from './index';
import { channels } from './channel-details';
import BulkEditor from './bulk-editor';
import EditList from './edit-list';

function Admin(props) {
  const api_key = process.env.REACT_APP_YT_KEY;
  const baseUrl = "https://www.googleapis.com/youtube/v3/";

  const settings = props.settings;
  const showSnackbar = props.showSnackbar;
  const dbVideos = props.dbVideos;

  const [editVids, setEditVids] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  
  const getDefaultSetProps = () => {
    return {
      isVerified: false,
      isLive: false,
      isSet: false,
      festival: '',
      year: '',
      artists: {
        1: ''
      },
      setName: '',
    }
  }

  let fetchedVideos = [];
  let latestVideoId = '';

  // gets new videos from youtube
  const getNewVidsFromYoutube = (channel, pageToken) => {
    const id = channels[channel].id;
    const page = pageToken ? '&pageToken=' + pageToken : '';

    fetch(baseUrl + "search?part=snippet%2Cid&channelId=" + id + "&maxResults=50&order=date&type=video&videoDuration=long&key=" + api_key + page)
      .then(res => res.json())
      .then(result => {
        let upToDate = false;
        const items = result.items ? result.items : [];

        for (let i = 0; i < items.length; i++) {
          if (latestVideoId && items[i].id.videoId === latestVideoId) {
            upToDate = true;
            break;
          }

          var videoObj = {
            id: items[i].id.videoId,
            details: items[i].snippet,
          };
          console.log('Adding: ', items[i].id.videoId);
          fetchedVideos.push(videoObj);
        }
        
        if (result.nextPageToken && !upToDate) {
          console.log('Going next page ', result.nextPageToken);
          getNewVidsFromYoutube(channel, result.nextPageToken);
        } else {
          addVideosToDB();
        };
      },
      error => {
        console.log(error);
      });
  }

  // add fetched videos with default setProps to db
  const addVideosToDB = () => {
    console.log('Adding all videos');
    let updates = {};
    console.log(fetchedVideos.length);

    if (fetchedVideos.length === 0) {
      showSnackbar(`${channels[settings.selectedChannel].title} is up to date`);
      return;
    }

    fetchedVideos.forEach(video => {
      updates['/videos/' + video.details.channelTitle + '/' + video.id] = Object.assign({}, {setProps: getDefaultSetProps()}, video.details);
    });

    database.ref().update(updates)
      .then(() => {
        console.log('Added Vids Successfully');
        console.log('Updating defaults');
        showSnackbar(`Added ${fetchedVideos.length} videos for ${channels[settings.selectedChannel].title}`);
      })
      .catch(err => console.log(err));
  }

  const setLatestVidFromDB = channel => {
    const channelName = channels[channel].title;
    var tempVideos = [];
    database.ref().child('/videos/' + channelName).orderByChild('publishedAt').once('value', snapshot => {
      snapshot.forEach(video => {
        const tempVideo = {
          id: video.key,
          details: video.val(),
        };
        tempVideos.push(tempVideo);
      });
      latestVideoId = tempVideos.length > 0 && tempVideos[tempVideos.length - 1].id;
      console.log('set latest vid id', latestVideoId);
      getNewVidsFromYoutube(channel);
    });
  }

  const getStatsForAllVids = () => {
    Object.keys(channels).forEach(channel => {
      dbVideos[channel].forEach(video => {
        if (video.details.setProps.isSet && video.details.setProps.isVerified) {
          getStatsForVid(video);
        }
      })
    })
  }

  const getStatsForVid = video => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&key=${api_key}&id=${video.id}`;

    fetch(url)
      .then(res => res.json())
      .then(result => {
        const statistics = (result.items && result.items[0].statistics) || null;

        if (!statistics) {
          console.log(`Failed to get stats for ${video.id}`);
          return;
        }

        statistics.displayRatio = displayRatio(statistics);
        statistics.actualRatio = actualRatio(statistics);
        statistics.displayViews = views(statistics);

        const obj = Object.assign({}, video.details, { stats: statistics });

        database.ref().child(`/videos/${video.details.channelTitle}/${video.id}`).update(obj)
        .then(() => {
          console.log(`Successfully ${video.id} with stats`)
        })
        .catch(err => console.log('Error updating videos with default', err));
      });
  }

  const actualRatio = stats => {
    const total = parseInt(stats.likeCount) + parseInt(stats.dislikeCount);
    const likes = parseInt(stats.likeCount);
    return (likes * 100) / total;
  }

  const displayRatio = stats => {
    const total = parseInt(stats.likeCount) + parseInt(stats.dislikeCount);
    const likes = parseInt(stats.likeCount);
    return Math.round(likes * 100 / total);
  }

  const views = stats => {
    const views = parseInt(stats.viewCount);

    if (views < 1000) return views;

    if (views < 1000000) {
      return Math.round(views/1000) + 'K';
    }

    return Math.round(views/100000)/10 + 'M';
  }

  const handleDialogClose = () => {
    setDialogIsOpen(false);
  }

  const handleFetchAllClick = channel => {
    fetchedVideos = [];
    latestVideoId = '';

    getNewVidsFromYoutube(channel);
  }

  const handleFetchNewClick = channel => {
    fetchedVideos = [];

    setLatestVidFromDB(channel);
  }

  const toggleEditVids = () => {
    dbVideos && setEditVids(editVids => !editVids);
  }

  const testFunction = () => {
    // let re = /([0-9]{4}( \| )|( - ))/;
    // dbVideos.forEach(video => {
    //   console.log('T: ', video.details.title);
    //   const arr = video.details.title.split(re);
    //   console.log('S: ', arr[arr.length-1]);
    // })
    // updateAllVidsWithDefaults();
  }

  return (
    <div>
      <h1>Admin</h1>
      <BulkEditor videos={dbVideos[settings.selectedChannel]}></BulkEditor>
      <Button
        className="user-button"
        variant="contained"
        color="secondary"
        onClick={() => toggleEditVids()}>Edit Videos</Button>
      <EditList videos={dbVideos[settings.selectedChannel]} show={editVids}></EditList>
      <div>
        <h2>From YouTube</h2>
        <Button
          className="user-button"
          variant="contained"
          color="secondary"
          onClick={() => handleFetchNewClick(settings.selectedChannel)}>Fetch New Videos</Button>
        <Button
          className="user-button"
          variant="contained"
          color="secondary"
          onClick={() => getStatsForAllVids()}>Fetch All Stats</Button>
        <h2>Testing</h2>
        <Button
          className="user-button"
          variant="contained"
          color="secondary"
          onClick={() => testFunction()}>Test</Button>
      </div>
      <Dialog onClose={handleDialogClose} open={dialogIsOpen}>
        <DialogTitle>Are you sure you want to fetch all videos?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fetching all videos will overwrite any existing video data with the new fetched data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>No</Button>
          <Button
            onClick={() => {
              handleDialogClose();
              handleFetchAllClick(settings.selectedChannel);
            }}
            variant="contained"
            color="secondary"
            >Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Admin;