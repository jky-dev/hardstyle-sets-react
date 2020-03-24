import React, { useState } from 'react';
import { Button,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import { database } from './index';
import VideoList from './video-list';

function Youtube() {
  const baseUrl = "https://www.googleapis.com/youtube/v3/";
  const api_key = process.env.REACT_APP_YT_KEY;
  let videos = [];
  const [selectedChannel, setSelectedChannel] = useState('b2s');
  const [dbVideos, setDbVideos] = useState([]);
  const channels = {
    b2s: {
      title: 'B2S',
      channelId: 'UCVLolPmtm4IPMHx5k0GISHg',
    },
    art_of_dance: {
      title: 'Art of Dance',
      channelId: 'UCWA006v5cHRVqJvwlzRxuHg',
    },
    q_dance: {
      title: 'Q-dance',
      channelId: 'UCAEwCfBRlB3jIY9whEfSP5Q',
    },
    bass_events: {
      title: 'Bass Events',
      channelId: 'UCGgQpBr1shI3IL4pVZ9Cplg',
    }
  };

  const getVidsForChannelFromYoutube = (id, pageToken) => {
    const page = pageToken ? '&pageToken=' + pageToken : '';

    fetch(baseUrl + "search?part=snippet%2Cid&channelId=" + id + "&maxResults=50&order=date&type=video&videoDuration=long&key=" + api_key + page)
      .then(res => res.json())
      .then(result => {
        const nextPage = result.nextPageToken;
        console.log('NextPg: ', nextPage);

        result.items && result.items.forEach(video => {
          var videoObj = {
            id: video.id.videoId,
            details: video.snippet,
          };
          console.log('Adding: ', video.id.videoId);
          videos.push(videoObj);
        });
        
        if (nextPage) {
          console.log('Going next page ', nextPage);
          getVidsForChannelFromYoutube(id, nextPage);
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
    console.log(videos.length);
    videos.forEach(video => {
      updates['/videos/' + video.details.channelTitle + '/' + video.id] = video.details;
    });
    database.ref().update(updates)
      .then()
      .catch(err => console.log(err));
  }

  const getVidsFromDB = channelName => {
    var tempVideos = [];
    database.ref().child('/videos/' + channelName).on('value', snapshot => {
      snapshot.forEach(video => {
        const tempVideo = {
          id: video.key,
          details: video.val(),
        };
        tempVideos.push(tempVideo);
      });
      setDbVideos(tempVideos);
    });
  }

  const handleFetchClick = (channelId) => {
    videos = [];
    getVidsForChannelFromYoutube(channelId);
  }

  const handleSelectChange = event => {
    setSelectedChannel(event.target.value);
  }

  return (
    <div>
      <div>
        <div>
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
        </div>
        <Button
          className="user-button"
          variant="contained"
          color="primary"
          onClick={() => getVidsFromDB(channels[selectedChannel].title)}>Get Vids From DB</Button>
        <Button
          className="user-button"
          variant="contained"
          color="secondary"
          onClick={() => handleFetchClick(channels[selectedChannel].channelId)}>Fetch YouTube Videos</Button>
      </div>
      <VideoList videos={dbVideos}></VideoList>
    </div>
  )
}

export default Youtube;