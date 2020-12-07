import { AppBar, CssBaseline, Toolbar, Typography, useMediaQuery } from "@material-ui/core";
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FireLogo from "./components/FireLogo";
import DashboardPage from "./pages/Dashboard";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";

export const useGlobalStyles = makeStyles({
  fullPage: {
    height: "calc(100vh - 56px)",
  },
});

const useStyles = makeStyles({
  logo: {
    marginRight: 8
  }
});

function App() {
  const classes = useStyles();
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
            <FireLogo className={classes.logo} />
            <Typography variant="h6" color="textPrimary">Burning</Typography>
          </Toolbar>
        </AppBar>

        <Switch>
          <Route exact path="/"><LoginPage /></Route>
          <Route path="/home"><LandingPage /></Route>
          <Route path="/dashboard"><DashboardPage /></Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
