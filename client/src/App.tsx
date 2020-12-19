import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BottomNavBar } from "./components/BottomNavBar";
import FireLogo from "./components/FireLogo";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import UserSelectionPage from "./pages/UserSelectionPage";
import LoginPage from "./pages/LoginPage";

const useStyles = makeStyles({
  logo: {
    marginRight: 8,
  },
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    height: "100vh",
  },
  content: {
    height: "100%",
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
          <AppBar position="static" color="inherit">
            <Toolbar>
              <FireLogo className={classes.logo} />
              <Typography variant="h6" color="textPrimary">
                Burning
              </Typography>
            </Toolbar>
          </AppBar>

          {/* TODO: Figure out how to change the '/' path to be appropriate depending on user's login level. */}
          <div className={classes.content}>
            <Switch>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <Route path="/home">
                <UserSelectionPage />
              </Route>
              <Route path="/dashboard">
                <HomePage />
              </Route>
              <Route path="/history">
                <HistoryPage />
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
