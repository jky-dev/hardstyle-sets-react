import React from 'react';
import './app.css';
import AddUser from './add-user';
import GetUser from './get-user';
import {
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
  useMediaQuery,
} from '@material-ui/core';

function App() {
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
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1>Hello World!</h1>
        <AddUser></AddUser>
        <GetUser></GetUser>
      </ThemeProvider>
    </div>
  );
}

export default App;
