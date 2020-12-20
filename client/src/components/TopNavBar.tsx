import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUsers } from "../store/slices/plexSlice";
import { AppDispatch } from "../store/store";
import FireLogo from "./FireLogo";
import UserDialog from "./UserDialog";

const useStyles = makeStyles({
  logo: {
    marginRight: 8,
  },
  grow: {
    flexGrow: 1,
  },
});

const TopNavBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar className={classes.grow}>
          <FireLogo className={classes.logo} />
          <Typography variant="h6" color="textPrimary" className={classes.grow}>
            Burning
          </Typography>
          <IconButton onClick={() => setOpen(true)}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <UserDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TopNavBar;
