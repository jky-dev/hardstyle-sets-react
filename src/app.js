import React, { useState } from 'react';
import './app.css';
import Youtube from './youtube';
import { auth } from './index';
import {
  AppBar,
  CssBaseline,
  createMuiTheme,
  IconButton,
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
    [theme.breakpoints.up('md')]: {
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
    padding: '0 1rem',
    width: '100%',
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  auth.onAuthStateChanged(user => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
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
        <Youtube mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}></Youtube>
      </Paper>
    </ThemeProvider>
  );
}

export default App;