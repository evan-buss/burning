import { v4 } from "uuid";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import shallow from "zustand/shallow";
import { Directory, PlexServer } from "../lib/plex/models";

interface StoreEntity<T> {
  byUUID: Record<string, T>;
  //   set: (entites: T[]) => void;
}

interface PlexState {
  servers: StoreEntity<PlexServer>;
  libraries: StoreEntity<Directory>;
}

interface AuthState {
  accessToken: string | null;
  clientId: string;
  userId: string | null;
}

export const useBurningStore = create<PlexState & AuthState>()(
  immer(
    devtools(
      persist(
        (set) => ({
          servers: {
            byUUID: {},
          },
          libraries: {
            byUUID: {},
          },
          accessToken: null,
          clientId: v4(),
          userId: null,
        }),
        {
          name: "auth",
          partialize: (state) => ({
            accessToken: state.accessToken,
            clientId: state.clientId,
            userId: state.userId,
          }),
        }
      )
    )
  )
);

export const usePlexCredentials = () =>
  useBurningStore(
    (state) => ({
      accessToken: state.accessToken,
      clientId: state.clientId,
    }),
    shallow
  );

export const setServers = (servers: PlexServer[]) =>
  useBurningStore.setState(({ servers: state }) => {
    state.byUUID = servers.reduce(
      (obj, item) => ((obj[item.clientIdentifier] = item), obj),
      {} as Record<string, PlexServer>
    );
  });

export const setLibraries = (libraries: Directory[]) =>
  useBurningStore.setState(({ libraries: state }) => {
    state.byUUID = libraries.reduce(
      (obj, item) => ((obj[item.uuid] = item), obj),
      {} as Record<string, Directory>
    );
  });

export const setAccessToken = (token: string) =>
  useBurningStore.setState((state) => {
    state.accessToken = token;
  });

export const setUserId = (userId: string | null) =>
  useBurningStore.setState((state) => {
    state.userId = userId;
  });

export const resetUserState = () =>
  useBurningStore.setState((state) => {
    state.accessToken = null;
    state.userId = null;
  });
