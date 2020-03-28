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

      title = video.details.title.replace(/&amp;/i, '&').replace(/&quot;/i, '"').replace(/&#39;/i, '\'');
      desc = video.details.description.replace(/&amp;/i, '&').replace(/&quot;/i, '"').replace(/&#39;/i, '\'');

      if (find && replace && title.includes(find)) {
        title = title.replace(new RegExp(find, 'g'), replace);
      }

      if (find && replace && desc.includes(find)) {
        desc = desc.replace(new RegExp(find, 'g'), replace);
      }

      video.details.title = title;
      video.details.description = desc;
    });

    updateVideos();
  }

  const setAll = () => {
    doReplace();
    setFestival();
    setName();
    setYear();
    checkIsSet();
    updateVideos();
  }

  const setFestival = () => {
    const festivals = [
      /def[- ]?qon[. ]?1/i,
      /reverze/i,
      /hard[- ]?bass/i,
      /decibel/i,
      /supremacy/i,
      /the qontinent/i,
      /dediqated/i,
      /epiq/i,
      /qlimax/i,
      /x-qlusive holland/i,
      /impaqt/i,
      /qapital/i,
      /x-qlusive da tweekaz/i,
      /q-base/i,
      /mysteryland/i,
      /x-qlusive frequencerz/i,
    ];

    checkVideos() && videos.forEach(video => {
      if (video.details.setProps.isVerified) {
        return;
      }

      for (let i = 0; i < festivals.length; i++) {
        const matches = video.details.title.match(festivals[i]);

        if (matches) {
          video.details.setProps.festival = matches[0];
          console.log(matches[0]);
        }
      }
    });

    updateVideos();
  }

  const setName = () => {
    const names = [/team [a-z]+ /i,];
    let title;

    // for getting set names per event
    const splits = [
      / @ /,
      / \| DEDIQATED /,
      / \| EPIQ/,
      / \| Qlimax/,
      / \| X-Qlusive Holland/,
      / \| IMPAQT/,
      / \| Defqon.1 2019/,
      /Defqon.1 2018 \| /,
      /Defqon.1 Weekend Festival 201[5-7] \| /,
      /Q-BASE 201[6-9] \| /,
      /QAPITAL 201[8-9] \| /,
      /Reverze 2020 \| /,
      /Qlimax 201[8-9] \| /,
      /X-Qlusive Da Tweekaz 2019 \| /,
      /X-Qlusive Holland XXL 2018 \| /,
      /X-Qlusive Frequencerz 2018 \| /,
    ];

    checkVideos() && videos.forEach(video => {
      if (video.details.setProps.isVerified) {
        return;
      }
      
      title = video.details.title;
      for (let i = 0; i < names.length; i++) {
        if (video.details.title.match(names[i])) {
          video.details.setProps.setName = video.details.title.match(names[i])[0];
          break;
        }
      }

      for (let i = 0; i < splits.length; i++) {
        if (title.match(splits[i])) {
          const splitArray = title.split(splits[i]);
          if (splitArray[0]) {
            video.details.setProps.setName = splitArray[0];
          } else {
            video.details.setProps.setName = splitArray[1];
          }
          break;
        }
      }
    });

    updateVideos();
  }

  const setYear = () => {
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
        return;
      }

      const custom = [{name: /DEDIQATED/, year: 2020}];
      for (let i = 0; i < custom.length; i++) {
        if (title.match(custom[i].name)) {
          video.details.setProps.year = custom[i].year;
          break;
        }
      }
    });
    updateVideos();
  }

  const checkIsSet = () => {
    const notSetKeywords = [
      /mix/i,
      /warm(ing)?[ -]?up/i,
      /end ?show/i,
      /movie/i,
      /re[- ]?cap/i,
      /favorites by/i,
      / top /i,
      /podcast/i,
      /we are the nightbreed/i,
      /down underground/i
    ];

    checkVideos() && videos.forEach(video => {
      if (video.details.setProps.isVerified) {
        return;
      }

      video.details.setProps.isSet = true;

      for (let i = 0; i < notSetKeywords.length; i++) {
        if (video.details.title.match(notSetKeywords[i])) {
          video.details.setProps.isSet = false;
          break;
        }
      }
    });

    updateVideos();
  }

  const checkVideos = () => {
    if (videos) {
      return true;
    } else {
      showSnackbar('No videos found');
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

  const showSnackbar = (msg) => {
    setSnackbarMessage(msg);
    setSnackbarIsOpen(true);
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
        onClick={() => setFestival()}>
        Set festival
      </Button>
      <Button
        className="user-button"
        variant="contained"
        color="primary"
        onClick={() => setName()}>
        Set name
      </Button>
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
        variant="contained"
        color="secondary"
        onClick={() => setAll()}>
        Set all
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