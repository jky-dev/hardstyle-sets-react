import React, { useState } from 'react';
import './app.css';
import Youtube from './youtube';
import { auth } from './index';
import {
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
  useMediaQuery,
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
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1>Hello {name ? name : 'World'}!</h1>
        <Youtube></Youtube>
      </ThemeProvider>
    </div>
  );
}

export default App;