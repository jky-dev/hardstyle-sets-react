import React, { useState } from 'react';
import {
  Button,
  Snackbar,
  TextField,
} from '@material-ui/core';
import { database } from './index';

function BulkEditor(props) {
  const videos = props.videos;
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);

  const doReplace = () => {
    let title;
    let desc;
    checkVideos() && videos.forEach(video => {
      if (video.details.setProps.isVerified) {
        return;
      }

      title = video.details.title;
      desc = video.details.description;
      if (title.includes(find)) {
        console.log('Before:', title);
        title = title.replace(new RegExp(find, 'g'), replace);
        console.log('After:', title);
        video.details.title = title;
      }
      if (desc.includes(find)) {
        console.log('Before:', desc);
        desc = desc.replace(new RegExp(find, 'g'), replace);
        console.log('After:', desc);
        video.details.description = desc;
      }
      console.log(video);
    });
    updateVideos();
  }

  const setYear = () => {
    let count = 0;
    let title;
    const re = /[0-9]{4}/;
    checkVideos() && videos.forEach(video => {
      if (video.details.setProps.isVerified) {
        return;
      }

      title = video.details.title;
      const match = title.match(re);
      if (match) {
        video.details.setProps.year = match[0];
        count++;
      }
    });
    setSnackbarMessage(`Update year for ${count} sets`);
    setSnackbarIsOpen(true);
    updateVideos();
  }

  const checkIsSet = () => {
    const notSetKeywords = [/mix/, /warm(ing)?[ -]?up/, /end\ ?show/, /movie/, /re[- ]?cap/];
    let count = 0;
    checkVideos() && videos.forEach(video => {
      if (video.details.setProps.isVerified) {
        return;
      }

      video.details.setProps.isSet = true;
      for (let i = 0; i < notSetKeywords.length; i++) {
        if (video.details.title.toLowerCase().match(notSetKeywords[i])) {
          console.log(video.details.title, notSetKeywords[i]);
          video.details.setProps.isSet = false;
          count++;
          break;
        }
      }
    });
    setSnackbarMessage(`Updated isSet for ${count} sets`);
    setSnackbarIsOpen(true);
  }

  const checkVideos = () => {
    if (videos) {
      return true;
    } else {
      setSnackbarMessage('No videos found');
      setSnackbarIsOpen(true);
      return false;
    }
  }

  const updateDb = () => {
    checkVideos() && videos.forEach(video => {
      const childRef = '/videos/' + video.details.channelTitle;
      const updateObj = {};
      updateObj[video.id] = video.details;
      database.ref().child(childRef).update(updateObj);
    });
  }

  const updateVideos = () => {
    props.setVideos(videos);
  }

  const handleFindChange = event => {
    setFind(event.target.value);
  }

  const handleReplaceChange = event => {
    setReplace(event.target.value);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarIsOpen(false);
  }

  return (
    <div>
      <h2>Replace</h2>
      <TextField
        variant="filled"
        label="Find"
        onChange={handleFindChange}
        value={find}
      />
      <TextField
        variant="filled"
        label="Replace"
        onChange={handleReplaceChange}
        value={replace}
      />
      <Button
        className="user-button"
        variant="contained"
        color="primary"
        onClick={() => doReplace()}>
        Replace
      </Button>
      <h2>Auto Stuff</h2>
      <Button
        className="user-button"
        variant="contained"
        color="primary"
        onClick={() => setYear()}>
        Set year
      </Button>
      <Button
        className="user-button"
        variant="contained"
        color="primary"
        onClick={() => checkIsSet()}>
        Set isSet
      </Button>
      <Button
        className="user-button"
        variant="outlined"
        color="secondary"
        onClick={() => updateDb()}>
        Update Videos to Database
      </Button>
      <Snackbar
        open={snackbarIsOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
}

export default BulkEditor;