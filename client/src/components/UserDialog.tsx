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
import { useDispatch, useSelector } from "react-redux";
import { PlexAccountUser } from "../store/models/plex.model";
import { setSelectedUser } from "../store/slices/plexSlice";
import { AppDispatch, RootState } from "../store/store";

export interface Props {
  open: boolean;
  selectedValue?: PlexAccountUser;
  onClose: () => void;
}

const UserDialog: React.FC<Props> = (props) => {
  const users = useSelector((state: RootState) => state.plex.users);
  const { open, selectedValue, onClose } = props;
  const dispatch = useDispatch<AppDispatch>();

  const handleUserSelect = (user?: PlexAccountUser) => {
    dispatch(setSelectedUser(user));
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="user-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="user-dialog-title">Who are you?</DialogTitle>
      <List>
        {users.map((user) => (
          <ListItem
            onClick={() => handleUserSelect(user)}
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
        <ListItem button onClick={() => handleUserSelect(undefined)}>
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
