import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetcher } from "../../services/fetcher";
import { AppThunk } from "../store";

export interface Server {
  name: string;
  ip: string;
  id: string;
  device: string;
}

export interface User {
  name: string;
  id: string;
}

export interface PlexState {
  selectedServer?: Server;
  serverOptions: Server[];
  users: User[];
}

const initialState: PlexState = {
  selectedServer: undefined,
  serverOptions: [],
  users: [],
};

const plexSlice = createSlice({
  name: "plex",
  initialState,
  reducers: {
    selectServer(state, action: PayloadAction<string>) {
      state.selectedServer = state.serverOptions.find(
        (x) => x.id === action.payload
      );
    },
    setServers(state, action: PayloadAction<Server[]>) {
      state.serverOptions = action.payload;
    },
  },
});

export const getServers = (): AppThunk => async (dispatch, getStore) => {
  const res = await fetcher("servers");
  if (res.status !== 200) return Promise.reject("Error fetching servers.");
  dispatch(setServers(res.data as Server[]));
};

export const { selectServer, setServers } = plexSlice.actions;
export default plexSlice.reducer;
