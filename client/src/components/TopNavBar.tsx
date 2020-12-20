import {
  AppBar,
  Avatar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import FireLogo from "./FireLogo";
import UserDialog from "./UserDialog";

const useStyles = makeStyles({
  logo: {
    marginRight: 8,
  },
  grow: {
    flexGrow: 1,
  },
  avatarImage: {
    height: "1.2em",
    width: "1.2em",
  },
});

const TopNavBar: React.FC = () => {
  const classes = useStyles();
  const selectedUser = useSelector((state: RootState) =>
    state.plex.users.find((x) => x.selected)
  );
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar className={classes.grow}>
          <FireLogo className={classes.logo} />
          <Typography variant="h6" color="textPrimary" className={classes.grow}>
            Burning
          </Typography>

          <IconButton onClick={() => setOpen(true)}>
            {selectedUser ? (
              <Avatar
                className={classes.avatarImage}
                alt={selectedUser.name}
                src={selectedUser.thumbnail}
              />
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <UserDialog
        open={open}
        selectedValue={selectedUser}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default TopNavBar;
