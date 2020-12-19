import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LibraryChip } from "../components/LibraryChip";
import { getServers, selectServer } from "../store/slices/plexSlice";
import { AppDispatch, RootState } from "../store/store";

const useStyles = makeStyles({
  heading: {
    padding: "1em",
    paddingBottom: "0em",
  },
  container: {
    padding: "1em",
  },
  buttonContainer: {
    position: "absolute",
    bottom: "8em",
  },
  plexButton: {
    padding: "1em 6em",
  },
});

const HomePage: React.FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch<AppDispatch>();
  const selectedServer = useSelector(
    (state: RootState) => state.plex?.selectedServer
  );
  const serverOptions = useSelector(
    (state: RootState) => state.plex?.serverOptions
  );
  const libraries = useSelector((state: RootState) => state.plex.libraries);

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  const handleServerSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(selectServer(event.target.value as string));
  };

  return (
    <>
      <Grid
        container
        justify="center"
        direction="row"
        className={classes.container}
      >
        <FormControl variant="filled" style={{ width: "100%" }}>
          <InputLabel id="server-select">Server</InputLabel>
          <Select
            labelId="server-select"
            id="server-select"
            // value={selectedServer?.id}
            onChange={handleServerSelect}
          >
            {serverOptions &&
              serverOptions?.map((server) => {
                return (
                  <MenuItem key={server.id} value={server.id}>
                    {server.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Grid>

      {selectedServer && (
        <>
          <Typography className={classes.heading} variant="h6">
            Libraries
          </Typography>
          <Grid
            container
            justify="center"
            direction="row"
            className={classes.container}
          >
            {libraries.map((lib) => {
              return <LibraryChip key={lib.id} lib={lib} />;
            })}
          </Grid>
        </>
      )}

      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Button
          className={classes.plexButton}
          variant="contained"
          color="primary"
        >
          Start Swiping
        </Button>
      </Grid>
    </>
  );
};

export default HomePage;
