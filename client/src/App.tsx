import { CssBaseline, useMediaQuery } from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BottomNavBar } from "./components/BottomNavBar";
import PrivateRoute from "./components/PrivateRoute";
import TopNavBar from "./components/TopNavBar";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SwipePage from "./pages/SwipePage";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    height: "100vh",
  },
  content: {
    height: "calc(100% - 11px)",
  },
});

function App() {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: "#E5A00D",
          },
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className={classes.container}>
          <TopNavBar />
          <div className={classes.content}>
            <Switch>
              <Route path="/login">
                <LoginPage />
              </Route>
              <PrivateRoute exact path="/">
                <HomePage />
              </PrivateRoute>
              <PrivateRoute path="/swipe">
                <SwipePage />
              </PrivateRoute>
              <PrivateRoute path="/history">
                <HistoryPage />
              </PrivateRoute>
              <Route path="*">
                <PrivateRoute path="/">
                  <HomePage />
                </PrivateRoute>
              </Route>
            </Switch>
          </div>
          <BottomNavBar />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
