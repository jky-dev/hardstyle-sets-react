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
import { channels } from './channel-details';
import Admin from './admin';
import Login from './login';
import VideoList from './video-list';

function Youtube() {
  const [dbVideos, setDbVideos] = useState({
    art_of_dance: [],
    bass_events: [],
    b2s: [],
    q_dance: [],
  });
  const [setAndVerifiedVideos, setSetAndVerifiedVideos] = useState({
    art_of_dance: [],
    bass_events: [],
    b2s: [],
    q_dance: [],
  });
  const [settings, setSettings] = useState({
    selectedChannel: 'q_dance',
    showVids: true,
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
      let tempVidObj = {};
      tempVidObj[channel] = tempVideos.reverse();
      setDbVideos(dbVideos => ({...dbVideos, ...tempVidObj}));
      let tempSetVerObj = {};
      tempSetVerObj[channel] = tempSetAndVerified.reverse();
      setSetAndVerifiedVideos(setAndVerifiedVideos => ({...setAndVerifiedVideos, ...tempSetVerObj}));
      showSnackbar(`Loaded ${tempVideos.length}, ${tempSetAndVerified.length} videos from DB for ${channels[channel].title}`);
    });
  }

  const handleSelectChange = event => {
    console.log(event.target.value);
    setSettings(settings => ({...settings, selectedChannel: event.target.value }));
    getVidsFromDB(event.target.value);
  }

  const toggleShowVids = () => {
    setSettings(settings => ({ ...settings, showVids: !settings.showVids }));
  }
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSettings(settings => ({...settings, snackbarIsOpen: false }));
  }

  const setVideos = (vids) => {
    var obj = {};
    obj[settings.selectedChannel] = vids;
    setDbVideos(dbVideos => ({...dbVideos, ...obj}));
  }

  const showSnackbar = msg => {
    setSettings(settings => ({...settings, snackbarMessage: msg, snackbarIsOpen: true}));
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
          <Button
            className="user-button"
            variant="contained"
            color="secondary"
            onClick={() => toggleShowVids()}>{settings.showVids ? 'Hide' : 'Show'} Videos</Button>
          <Box flexGrow={1}></Box>
          <Box>
            <Login></Login>
          </Box>
        </Box>

        <VideoList videos={setAndVerifiedVideos[settings.selectedChannel]} show={settings.showVids}></VideoList>
        {isLoggedIn () && <Admin
          settings={settings}
          setVideos={setVideos}
          showSnackbar={showSnackbar}
          dbVideos={dbVideos} >
        </Admin>}
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