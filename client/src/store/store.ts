import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import plexReducer, { selectedServerSelector } from "./slices/plexSlice";
import authReducer, { persistUserState } from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    plex: plexReducer,
    auth: authReducer,
  },
});

axios.defaults.baseURL = "http://localhost:8000/api/";
axios.defaults.timeout = 10_000;
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers = {
    ...config.headers,
    "x-plex-token": store.getState().auth.accessToken,
    "x-client-id": store.getState().auth.clientId,
    "x-server-ip": selectedServerSelector(store.getState())?.ip,
  };
  return config;
});

persistUserState(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
