import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Typography
} from '@material-ui/core';
import { database } from './index';
import { channels } from './channel-details';
import Admin from './admin';
import VideoList from './video-list';

function Youtube() {
  const [dbVideos, setDbVideos] = useState({
    art_of_dance: [],
    bass_events: [],
    b2s: [],
    q_dance: [],
  });
  const [allVidsSorted, setAllVidsSorted] = useState([]);
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
  const [loadedCounter, setLoadedCounter] = useState(0);

  useEffect(() => {
    getAllVidsFromDB();
  }, []);

  useEffect(() => {
    loadedCounter === 4 && sortAllVideosByDate();
  }, [loadedCounter])

  const isLoggedIn = () => {
    return sessionStorage.getItem('user');
  }

  const getAllVidsFromDB = () => {
    Object.keys(channels).forEach((key, value) => {
      console.log(key, channels[key]);
      getVidsFromDB(key);
    });
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
      setLoadedCounter(loadedCounter => (loadedCounter + 1));
      console.log(`Loaded ${tempVideos.length}, ${tempSetAndVerified.length} videos from DB for ${channels[channel].title}`);
      showSnackbar(`Loaded ${tempVideos.length}, ${tempSetAndVerified.length} videos from DB for ${channels[channel].title}`);
    });
  }

  const sortAllVideosByDate = () => {
    console.log('sorting');
    let allVids = [];
    Object.values(setAndVerifiedVideos).forEach(array => {
      console.log(array);
      allVids = [...allVids, ...array];
    });
    console.log(allVids);
    allVids.sort((a, b) => {
      return b.details.publishedAt > a.details.publishedAt ? 1 : -1 });
    console.log(allVids);
    setAllVidsSorted(allVids);
  }

  const handleSelectChange = event => {
    console.log(event.target.value);
    setSettings(settings => ({...settings, selectedChannel: event.target.value }));
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
          onClick={() => toggleShowVids()}>{settings.showVids ? 'Hide' : 'Show'}</Button>
        <Typography variant="h6" className="category-heading">Most Recent</Typography>
        <VideoList videos={allVidsSorted} show={settings.showVids}></VideoList>
        {isLoggedIn () &&
          <Admin
            settings={settings}
            setVideos={setVideos}
            showSnackbar={showSnackbar}
            dbVideos={dbVideos} >
          </Admin>
        }
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