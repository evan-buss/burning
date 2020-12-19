import axios, { AxiosRequestConfig } from "axios";
import { store } from "../store/store";

export const fetcher = axios.create({
  baseURL: "http://localhost:8000/api/",
  timeout: 10000,
});

const addHeaders = (config: AxiosRequestConfig) => {
  config.headers = {
    ...config.headers,
    "x-plex-token": store.getState().user.accessToken,
    "x-client-id": store.getState().user.clientId,
    "x-server-ip": store.getState().plex?.selectedServer?.ip,
  };
  return config;
};

fetcher.interceptors.request.use(addHeaders);
