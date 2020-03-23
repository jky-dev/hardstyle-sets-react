import React from 'react';
import { Button } from '@material-ui/core';
import { database } from './index';

function Youtube() {
  let baseUrl = "https://www.googleapis.com/youtube/v3/";
  const api_key = process.env.REACT_APP_YT_KEY;
  let videos = [];

  const getVideosForChannel = (id, pageToken) => {
    let nextPage;
    const page = pageToken ? '&pageToken=' + pageToken : '';
    fetch(baseUrl + "search?part=snippet%2Cid&channelId=" + id + "&maxResults=50&order=date&type=video&key=" + api_key + page)
      .then(res => res.json())
      .then(result => {
        nextPage = result.nextPageToken;
        console.log('NextPg: ', nextPage);
        const items = result.items;
        items.forEach(video => {
          var videoObj = {
            id: video.id.videoId,
            details: video.snippet,
          };
          console.log('Adding: ', video.id.videoId);
          videos.push(videoObj);
        });
        if (nextPage) {
          console.log('Going next page ', nextPage);
          getVideosForChannel(id, nextPage);
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

  return (
    <div>
      <div className="center-button">
        <div>
          <Button
            className="user-button"
            variant="contained"
            color="primary"
            onClick={() => {
              videos = [];
              getVideosForChannel('UCGgQpBr1shI3IL4pVZ9Cplg');
            }}>Get Bass Event Vids</Button>
        </div>
        <div>
          <Button
            className="user-button"
            variant="contained"
            color="primary"
            onClick={() => {
              videos = [];
              getVideosForChannel('UCAEwCfBRlB3jIY9whEfSP5Q')
            }}>Get Q-Dance Vids</Button>
        </div>
        <div>
          <Button
            className="user-button"
            variant="contained"
            color="primary"
            onClick={() => {
              videos = [];
              getVideosForChannel('UCVLolPmtm4IPMHx5k0GISHg')
            }}>Get B2S Vids</Button>
        </div>
        <div>
          <Button
            className="user-button"
            variant="contained"
            color="primary"
            onClick={() => {
              videos = [];
              getVideosForChannel('UCWA006v5cHRVqJvwlzRxuHg')
            }}>Get Art of Dance Vids</Button>
        </div>
      </div>
    </div>
  )
}

export default Youtube;