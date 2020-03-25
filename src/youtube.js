import React, { useState } from 'react';
import {
  Box, 
  Button,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import { database } from './index';
import Login from './login';
import VideoList from './video-list';

function Youtube() {
  const api_key = process.env.REACT_APP_YT_KEY;
  const baseUrl = "https://www.googleapis.com/youtube/v3/";
  const channels = {
    art_of_dance: {
      title: 'Art of Dance',
      id: 'UCWA006v5cHRVqJvwlzRxuHg',
    },
    bass_events: {
      title: 'Bass Events',
      id: 'UCGgQpBr1shI3IL4pVZ9Cplg',
    },
    b2s: {
      title: 'B2S',
      id: 'UCVLolPmtm4IPMHx5k0GISHg',
    },
    q_dance: {
      title: 'Q-dance',
      id: 'UCAEwCfBRlB3jIY9whEfSP5Q',
    },
  };

  const [dbVideos, setDbVideos] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('b2s');
  const [showVids, setShowVids] = useState(false);

  let fetchedVideos = [];
  let latestVideoId = '';

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

  const addVideosToDB = () => {
    console.log('Adding all videos');
    let updates = {};
    console.log(fetchedVideos.length);

    fetchedVideos.forEach(video => {
      updates['/videos/' + video.details.channelTitle + '/' + video.id] = Object.assign({}, {setProps: getDefaultSetProps()}, video.details);
    });

    database.ref().update(updates)
      .then(() => {
        console.log('Added Vids Successfully');
        console.log('Updating defaults');
        updateAllVidsWithDefaults();
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

  const getVidsFromDB = channel => {
    const channelName = channels[channel].title;
    var tempVideos = [];

    database.ref().child('/videos/' + channelName).orderByChild('publishedAt').on('value', snapshot => {
      snapshot.forEach(video => {
        const tempVideo = {
          id: video.key,
          details: video.val(),
        };

        tempVideos.push(tempVideo);
      });

      setDbVideos(tempVideos.reverse());
    });
  }

  const updateAllVidsWithDefaults = () => {
    let obj = {};
    database.ref().child('/videos').once('value', channels => {
      let channelName;
      let channelObj = {};

      channels.forEach(channel => {
        channelName = channel.key;
        channelObj = {};

        channel.forEach(video => {
          if (!video.val().setProps) {
            channelObj[video.key] = Object.assign({}, {setProps: getDefaultSetProps()}, video.val());
          } else {
            channelObj[video.key] = video.val();
          }
        });

        obj[channelName] = channelObj;
      });
      database.ref().child('/videos').update(obj)
        .then(() => {
          console.log('Successfully updated videos with defaults')
        })
        .catch(err => console.log('Error updating videos with default', err));
    });
  }

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

  const handleFetchAllClick = channel => {
    fetchedVideos = [];
    latestVideoId = '';

    getNewVidsFromYoutube(channel);
  }

  const handleFetchNewClick = channel => {
    fetchedVideos = [];

    setLatestVidFromDB(channel);
  }

  const handleSelectChange = event => {
    setSelectedChannel(event.target.value);
  }

  const toggleShowVids = () => {
    setShowVids(!showVids);
  }

  const testFunction = () => {
    // let re = /([0-9]{4}( \| )|( - ))/;
    // dbVideos.forEach(video => {
    //   console.log('T: ', video.details.title);
    //   const arr = video.details.title.split(re);
    //   console.log('S: ', arr[arr.length-1]);
    // })
    updateAllVidsWithDefaults();
  }

  return (
    <div>
      <div>
        <Box flexDirection="row" display="flex">
          <Box>
            <FormControl>
              <Select
                value={selectedChannel}
                onChange={handleSelectChange}
              >
                {
                  Object.keys(channels).map(key => (
                    <MenuItem value={key} key={key}>{channels[key].title}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
          <Box flexGrow={1}></Box>
          <Box><Login></Login></Box>
        </Box>
        <h2>From Database</h2>
        <Button
          className="user-button"
          variant="contained"
          color="primary"
          onClick={() => getVidsFromDB(selectedChannel)}>Get Vids From DB</Button>
        <Button
          className="user-button"
          variant="contained"
          color="secondary"
          onClick={() => toggleShowVids()}>{showVids ? 'Hide' : 'Show'} Videos</Button>
        <VideoList videos={dbVideos} show={showVids}></VideoList>
        {sessionStorage.getItem('user') &&
          <div>
            <h2>From YouTube</h2>
            <Button
              className="user-button"
              variant="contained"
              color="secondary"
              onClick={() => handleFetchNewClick(selectedChannel)}>Fetch New Videos</Button>
            <Button
              className="user-button"
              variant="outlined"
              color="secondary"
              onClick={() => handleFetchAllClick(selectedChannel)}>Fetch All Videos</Button>
            <h2>Testing</h2>
            <Button
              className="user-button"
              variant="contained"
              color="secondary"
              onClick={() => testFunction()}>Test</Button>
          </div>
        }
      </div>
    </div>
  )
}

export default Youtube;