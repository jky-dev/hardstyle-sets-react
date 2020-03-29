import React, { useState } from 'react';
import './app.css';
import Youtube from './youtube';
import { auth } from './index';
import {
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
  useMediaQuery,
  Paper,
} from '@material-ui/core';

function App() {
  const [name, setName] = useState(null);

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
        <h1>Hardstyle Sets - Hello {name ? name : 'World'}!</h1>
        <Youtube></Youtube>
      </Paper>
    </ThemeProvider>
  );
}

export default App;