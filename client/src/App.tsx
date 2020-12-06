import { AppBar, CssBaseline, Toolbar, Typography, useMediaQuery } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          secondary: {
            main: "#E5A00D",
          },
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Typography variant="h6" color="secondary">Burning for Plex</Typography>
          </Toolbar>
        </AppBar>

        <Switch>
          <Route exact path="/"><LoginPage /></Route>
          <Route path="/home"><LandingPage /></Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
