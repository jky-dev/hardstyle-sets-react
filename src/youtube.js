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
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    [theme.breakpoints.up('md')]: {
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

  const [dbVideos, setDbVideos] = useState({}); // is an object with channel: [videos]
  const [allVidsSorted, setAllVidsSorted] = useState([]);
  const [setAndVerifiedVideos, setSetAndVerifiedVideos] = useState({}); // is an object with channel: [videos]
  const [settings, setSettings] = useState({
    selectedChannel: 'q_dance',
    snackbarIsOpen: false,
    snackbarMessage: '',
  });
  const [shownVideoList, setShownVideoList] = useState([]);
  const [loadedCounter, setLoadedCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSortType, setSelectedSortType] = useState('Most Recent');
  const [displaySelectedChannel, setDisplaySelectedChannel] = useState('All Channels')

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
      allVids = [...allVids, ...array];
    });
    allVids.sort((a, b) => {
      return b.details.publishedAt > a.details.publishedAt ? 1 : -1 });
    setAllVidsSorted(allVids);
    setShownVideoList(allVids);
    setLoading(false);
  }

  const handleAllVidsClick = () => {
    setShownVideoList(allVidsSorted);
    setDisplaySelectedChannel('All Channels');
    setSelectedSortType('Most Recent');
  }

  const handleChannelSelect = channel => {
    setSettings(settings => ({...settings, selectedChannel: channel }));
    setShownVideoList(setAndVerifiedVideos[channel]);
    setDisplaySelectedChannel(channels[channel].title);
    setSelectedSortType('Most Recent');
  }

  const handleSelectedSortType = sortType => {
    const sorted = [...shownVideoList];
    if (sortType === 'Most Viewed') {
      sorted.sort((a, b) => {
        return parseInt(b.details.stats.viewCount) > parseInt(a.details.stats.viewCount) ? 1 : -1 });
      setShownVideoList(sorted);
      setSelectedSortType(sortType);
    }

    if (sortType === 'Most Recent') {
      sorted.sort((a, b) => {
        return b.details.publishedAt > a.details.publishedAt ? 1 : -1 });
      setShownVideoList(sorted);
      setSelectedSortType(sortType);
    }

    if (sortType === 'Top Rated') {
      sorted.sort((a, b) => {
        return parseInt(b.details.stats.actualRatio) > parseInt(a.details.stats.actualRatio) ? 1 : -1 });
      setShownVideoList(sorted);
      setSelectedSortType(sortType);
    }
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
        {['Most Recent', 'Top Rated', 'Most Viewed'].map(sortType => (
          <ListItem
            button
            onClick={() => handleSelectedSortType(sortType)}>
            <ListItemText primary={sortType} />
          </ListItem>
        ))}
        <Divider />
        <ListItem>
          <ListItemText primary="Channels" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => handleAllVidsClick()} >
          <ListItemText primary="All Channels" />
        </ListItem>
        {Object.keys(channels).map((channel, index) => (
          <ListItem
            button
            key={channels[channel].title}
            onClick={() => handleChannelSelect(channel)}>
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
        <Hidden mdUp implementation="css">
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
        <Hidden smDown implementation="css">
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
              <Typography variant="h6" className="category-heading">{selectedSortType} - {displaySelectedChannel}</Typography>
              <VideoList videos={shownVideoList}></VideoList>
              {isAdmin() &&
                <Admin
                  settings={settings}
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