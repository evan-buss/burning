import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Library, PlexAccountUser, Server } from "../models/plex.model";
import { AppThunk, RootState } from "../store";

interface PlexState {
  servers: Server[];
  users: PlexAccountUser[];
  libraries: Library[];
}

const initialState: PlexState = {
  servers: [],
  users: [],
  libraries: [],
};

const plexSlice = createSlice({
  name: "plex",
  initialState,
  reducers: {
    toggleSelectedLibrary(state, action: PayloadAction<Library>) {
      let libIndex = state.libraries.findIndex(
        (x) => x.id === action.payload.id
      );
      if (libIndex > -1) {
        state.libraries[libIndex].selected = !state.libraries[libIndex]
          .selected;
      }
    },
    setLibraries(state, action: PayloadAction<Library[]>) {
      state.libraries = action.payload;
    },
    setUsers(state, action: PayloadAction<PlexAccountUser[]>) {
      state.users = action.payload;
    },
    setSelectedServer(state, action: PayloadAction<Server | undefined>) {
      state.servers = state.servers.map((x) => {
        x.selected = x.id === action.payload?.id;
        return x;
      });
    },
    setServers(state, action: PayloadAction<Server[]>) {
      state.servers = action.payload;
    },
  },
});

export const selectedServerSelector = createSelector(
  (state: RootState) => state.plex.servers,
  (servers) => servers.find((x) => x.selected)
);

export const {
  toggleSelectedLibrary,
  setServers,
  setUsers,
} = plexSlice.actions;
export default plexSlice.reducer;

export const getUsers = (): AppThunk => async (dispatch) => {
  try {
    const res = await axios.get("users");
    dispatch(plexSlice.actions.setUsers(res.data as PlexAccountUser[]));
  } catch (err) {
    console.log(err);
  }
};

export const getServers = (): AppThunk => async (dispatch) => {
  const res = await axios("servers");
  if (res.status !== 200) return Promise.reject("Error fetching servers.");
  dispatch(setServers(res.data as Server[]));
  dispatch(selectServer((res.data[0] as Server)?.id));
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
    const selected = getStore().plex.servers.find((x) => x.id === serverId);
    dispatch(plexSlice.actions.setSelectedServer(selected));
    dispatch(getLibraries());
  } catch (err) {
    console.log(err);
  }
};
