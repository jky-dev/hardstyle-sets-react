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

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const [name, setName] = useState(null);
  const classes = useStyles();

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

  return (
    <ThemeProvider theme={theme}>
      <Paper className="App">
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" className={classes.title}>
              Hardstyle Sets
            </Typography>
            <Login color="inherit"></Login>
          </Toolbar>
        </AppBar>
        <Youtube></Youtube>
      </Paper>
    </ThemeProvider>
  );
}

export default App;