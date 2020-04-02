import React, { useState } from 'react';
import './app.css';
import Youtube from './youtube';
import { auth } from './index';
import { channels } from './channel-details';
import {
  AppBar,
  CssBaseline,
  createMuiTheme,
  IconButton,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import Login from './login';
import MenuIcon from '@material-ui/icons/Menu';

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
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
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
    padding: '0 1rem',
    width: '100%',
    flexGrow: 1,
  },
}));

function App() {
  const [name, setName] = useState(null);
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  auth.onAuthStateChanged(user => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      setName(user.displayName)
    } else {
      sessionStorage.removeItem("user");
      setName(null);
    }
  });

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

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {Object.values(channels).map((channel, index) => (
          <ListItem button key={channel.title}>
            <ListItemText primary={channel.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Paper className="App">
          <CssBaseline />
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                className={classes.menuButton} >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Hardstyle Sets
              </Typography>
              <Login color="inherit"></Login>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
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
          <Youtube ></Youtube>
        </main>
        </Paper>
      </ThemeProvider>
    </div>
  );
}

export default App;