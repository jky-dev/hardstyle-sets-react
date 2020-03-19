import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from "@material-ui/core/CssBaseline";

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

  function clickHandler() {
    alert("Hi!");
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1>Hello World!</h1>
        <Button variant="contained" color="primary" onClick={clickHandler}>
          Click me!
        </Button>
      </ThemeProvider>
    </div>
  );
}

export default App;
