import {
  Avatar,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import { PlexAccountUser } from "../store/models/plex.model";
import { RootState } from "../store/store";

export interface Props {
  open: boolean;
  selectedValue?: PlexAccountUser;
  onClose: (value: string) => void;
}

const UserDialog: React.FC<Props> = (props) => {
  const users = useSelector((state: RootState) => state.plex.users);
  const { open, selectedValue, onClose } = props;

  return (
    <Dialog
      onClose={() => onClose("WOWEE")}
      aria-labelledby="user-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="user-dialog-title">Who are you?</DialogTitle>
      <List>
        {users.map((user) => (
          <ListItem
            selected={user.id === selectedValue?.id}
            button
            key={user.id}
          >
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.thumbnail} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}

        <Divider />
        <ListItem
          button
          //   onClick={() => logOut()}
        >
          <ListItemAvatar>
            <Avatar>
              <ExitToApp color="action" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </Dialog>
  );
};

export default UserDialog;
