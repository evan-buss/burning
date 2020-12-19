import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import plexReducer from "./slices/plexSlice";
import userReducer, { persistUserState } from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    plex: plexReducer,
    user: userReducer,
  },
});

axios.defaults.baseURL = "http://localhost:8000/api/";
axios.defaults.timeout = 10_000;
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers = {
    ...config.headers,
    "x-plex-token": store.getState().user.accessToken,
    "x-client-id": store.getState().user.clientId,
    "x-server-ip": store.getState().plex?.selectedServer?.ip,
  };
  return config;
});

persistUserState(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
