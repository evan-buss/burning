import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Library, PlexAccountUser, Server } from "../models/plex.model";
import { AppThunk } from "../store";

interface PlexState {
  selectedServer?: Server;
  serverOptions: Server[];
  users: PlexAccountUser[];
  libraries: Library[];
}

const initialState: PlexState = {
  selectedServer: undefined,
  serverOptions: [],
  users: [],
  libraries: [],
};

const plexSlice = createSlice({
  name: "plex",
  initialState,
  reducers: {
    setSelectedServer(state, action: PayloadAction<Server | undefined>) {
      state.selectedServer = action.payload;
    },
    setUsers(state, action: PayloadAction<PlexAccountUser[]>) {
      state.users = action.payload;
    },
    setLibraries(state, action: PayloadAction<Library[]>) {
      state.libraries = action.payload;
    },
    setServers(state, action: PayloadAction<Server[]>) {
      state.serverOptions = action.payload;
    },
  },
});

export const getUsers = (): AppThunk => async (dispatch) => {
  try {
    const res = await axios.get("users");
    dispatch(plexSlice.actions.setUsers(res.data as PlexAccountUser[]));
  } catch (err) {
    console.log(err);
  }
};

export const { setServers, setUsers } = plexSlice.actions;
export default plexSlice.reducer;

export const getServers = (): AppThunk => async (dispatch) => {
  const res = await axios("servers");
  if (res.status !== 200) return Promise.reject("Error fetching servers.");
  dispatch(setServers(res.data as Server[]));
};

export const getLibraries = (): AppThunk => async (dispatch) => {
  try {
    const res = await axios("libraries");
    dispatch(plexSlice.actions.setLibraries(res.data as Library[]));
  } catch (err) {
    console.log(err);
  }
};

export const selectServer = (serverId: string): AppThunk => async (
  dispatch,
  getStore
) => {
  try {
    const selected = getStore().plex.serverOptions.find(
      (x) => x.id === serverId
    );
    dispatch(plexSlice.actions.setSelectedServer(selected));
    dispatch(getLibraries());
  } catch (err) {
    console.log(err);
  }
};
