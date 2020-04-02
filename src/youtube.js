import React, { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  createMuiTheme,
  Divider,
  Drawer,
  FormControl,
  Hidden,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  Typography,
  useMediaQuery,
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
  root: {
    display: 'flex',
    height: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
  },
  appBar: {
    position: 'fixed',
    zIndex: theme.zIndex.drawerPaper + 1,
    width: '100%',
    flexGrow: 1,
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
    padding: '1rem 1rem 0 1rem',
    width: '100%',
    flexGrow: 1,
    height: '100vh',
  },
}));

function Youtube(props) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => 
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

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
        {Object.values(channels).map((channel, index) => (
          <ListItem button key={channel.title}>
            <ListItemText primary={channel.title} />
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
          {loading &&
            <div className="full-screen">
              <CircularProgress />
            </div>
          }
          {!loading &&
            <div>
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