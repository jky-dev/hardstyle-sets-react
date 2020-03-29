import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Snackbar,
} from '@material-ui/core';
import { database } from './index';
import Admin from './admin';
import Login from './login';
import VideoList from './video-list';

function Youtube() {

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
  const [setAndVerifiedVideos, setSetAndVerifiedVideos] = useState([]);
  const [settings, setSettings] = useState({
    selectedChannel: 'b2s',
    showVids: true,
    editVids: false,
    snackbarIsOpen: false,
    snackbarMessage: '',
  });




  useEffect(() => {
    getVidsFromDB(settings.selectedChannel);
  }, []);

  const isLoggedIn = () => {
    return sessionStorage.getItem('user');
  }

  const getVidsFromDB = channel => {
    const channelName = channels[channel].title;
    var tempVideos = [];
    var tempSetAndVerified = [];

    database.ref().child('/videos/' + channelName).orderByChild('publishedAt').once('value', snapshot => {
      snapshot.forEach(video => {
        const tempVideo = {
          id: video.key,
          details: video.val(),
        };
        tempVideos.push(tempVideo);
        if (video.val().setProps.isSet && video.val().setProps.isVerified) {
          tempSetAndVerified.push(tempVideo);
        }
      });
      setDbVideos(tempVideos.reverse());
      setSetAndVerifiedVideos(tempSetAndVerified.reverse());
      showSnackbar(`Loaded ${tempVideos.length}, ${tempSetAndVerified.length} videos from DB for ${channels[channel].title}`);
    });
  }

  const handleSelectChange = event => {
    console.log(event.target.value);
    setSettings(settings => Object.assign({}, settings, { selectedChannel: event.target.value }));
    getVidsFromDB(event.target.value);
  }

  const toggleShowVids = () => {
    setAndVerifiedVideos.length > 0 && setSettings(settings => Object.assign({}, settings, { showVids: !settings.showVids }));
  }
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSettings(settings => Object.assign({}, settings, { snackbarIsOpen: false }));
  }

  const setVideos = (vids) => {
    setDbVideos(vids);
  }

  const showSnackbar = msg => {
    const update = {
      snackbarMessage: msg,
      snackbarIsOpen: true,
    }
    setSettings(settings => Object.assign({}, settings, update));
  }

  return (
    <div>
      <div>
        <Box flexDirection="row" display="flex">
          <FormControl>
            <Select
              value={settings.selectedChannel}
              onChange={handleSelectChange}
            >
              {Object.keys(channels).map(key =>
                <MenuItem value={key} key={key}>{channels[key].title}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Box flexGrow={1}></Box>
          <Box>
            <Login></Login>
          </Box>
        </Box>
        <Button
          className="user-button"
          variant="contained"
          color="secondary"
          onClick={() => toggleShowVids()}>{settings.showVids ? 'Hide' : 'Show'} Videos</Button>
        <VideoList videos={setAndVerifiedVideos} show={settings.showVids}></VideoList>
        <Admin
          settings={settings}
          setVideos={setVideos}
          showSnackbar={showSnackbar}
          dbVideos={dbVideos}
          setSettings={setSettings}
          >
        </Admin>
        <Snackbar
          autoHideDuration={1000}
          message={settings.snackbarMessage}
          open={settings.snackbarIsOpen}
          onClose={handleSnackbarClose} />
      </div>
    </div>
  )
}

export default Youtube;