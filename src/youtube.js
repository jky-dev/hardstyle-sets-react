import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Snackbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import { database } from './index';
import { channels } from './channel-details';
import Admin from './admin';
import VideoList from './video-list';

const drawerWidth = 140;

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    padding: '1rem',
    width: '100%',
    minHeight: '100vh',
  },
}));

function Youtube(props) {
  const classes = useStyles();
  const theme = useTheme();

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVidsFromDB();
  }, []);

  useEffect(() => {
    loadedCounter === 4 && sortAllVideosByDate();
  }, [loadedCounter])

  const isLoggedIn = () => {
    return sessionStorage.getItem('user');
  }

  const isAdmin = () => {
    return sessionStorage.getItem('user') &&
      JSON.parse(sessionStorage.getItem('user')).uid === 'cVfzuiMGbHQApk0i7h27i7LgMoK2';
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
    setLoading(false);
  }

  const handleSelectChange = channel => {
    console.log(channel);
    setSettings(settings => ({...settings, selectedChannel: channel }));
  }

  const handleDrawerToggle = () => {
    props.setMobileOpen();
  };
  
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

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem button>
          <ListItemText primary="Most Recent" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Top Rated" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Most Viewed" />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Channels" />
        </ListItem>
        <Divider />
        {Object.keys(channels).map((channel, index) => (
          <ListItem
            button
            key={channels[channel].title}
            onClick={() => handleSelectChange(channel)}>
            <ListItemText primary={channels[channel].title} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={props.mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar}></div>
        <div>
          {loading &&
            <div className="full-screen">
              <CircularProgress />
            </div>
          }
          {!loading &&
            <div>
              <Typography variant="h6" className="category-heading">Most Recent</Typography>
              <VideoList videos={allVidsSorted} show={settings.showVids}></VideoList>
              {isAdmin() &&
                <Admin
                  settings={settings}
                  setVideos={setVideos}
                  showSnackbar={showSnackbar}
                  dbVideos={dbVideos} >
                </Admin>
              }
            </div>
          }
        </div>
      </main>
      <Snackbar
        autoHideDuration={1000}
        message={settings.snackbarMessage}
        open={settings.snackbarIsOpen}
        onClose={handleSnackbarClose} />
    </div>
  )
}

export default Youtube;