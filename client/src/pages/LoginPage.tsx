import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  authLinkSelector,
  checkTokenValidity,
  fetchPins,
  tokenToPin,
} from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => new URLSearchParams(useLocation().search);

const useStyles = makeStyles({
  title: {
    fontSize: "2em",
  },
  plexButton: {
    marginTop: "2em",
    padding: "1em",
  },
});

const LoginPage: React.FC = () => {
  const query = useQuery();
  const classes = useStyles();
  const history = useHistory();

  const user = useSelector((state: RootState) => state.auth);
  const authLink = useSelector(authLinkSelector);
  const dispatch = useDispatch<AppDispatch>();

  //1) Choose a unique app name, like “My Cool Plex App”
  //2) Check storage for your app’s Client Identifier; generate and store one if none is present.
  //3) Check storage for the user’s Access Token; if present, verify its validity and carry on.
  //4) If an Access Token is missing or invalid, generate a PIN, and store its id.
  //5) Construct an Auth App url and send the user’s browser there to authenticate.
  //6) After authentication, check the PIN’s id to obtain and store the user’s Access Token.
  useEffect(() => {
    // User logged in. Get their access token.
    if (query.has("postback")) {
      dispatch(tokenToPin()).then((result) => {
        if (tokenToPin.fulfilled.match(result)) {
          history.push("/home");
        }
      });
    } else if (user.accessToken) {
      dispatch(checkTokenValidity()).then((result) => {
        if (checkTokenValidity.fulfilled.match(result)) {
          const isValid = result.payload;
          if (isValid) {
            history.push("/home");
            return;
          }
          dispatch(fetchPins());
        }
      });
    } else {
      dispatch(fetchPins());
    }
  }, []);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ height: "100%" }}
    >
      <Typography variant="h1" className={classes.title}>
        Burning for Plex
      </Typography>
      <Button
        href={authLink ?? ""}
        className={classes.plexButton}
        variant="contained"
        color="primary"
        disabled={authLink === null}
      >
        Log In with Plex Account
      </Button>
    </Grid>
  );
};

export default LoginPage;
