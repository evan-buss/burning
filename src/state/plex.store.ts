import create from "zustand";
import { devtools } from "zustand/middleware";
import { PlexServer } from "../lib/plex/plex.model";

interface PlexState {
  byUUID: Record<string, PlexServer>;
}

export const usePlexState = create<PlexState>()(
  devtools(() => ({ byUUID: {} }))
);

// export const setServers = (servers: PlexServer[]) =>
//   usePlexState.setState(() => ({
//     byUUID: servers.reduce(
//       (obj, item) => ((obj[item.clientIdentifier] = item), obj),
//       {} as Record<string, PlexServer>
//     ),
//   }));

export const setServers = (servers: PlexServer[]) =>
  usePlexState.setState(() => ({
    byUUID: servers.reduce((obj, item) => {
      obj[item.clientIdentifier] = item;
      return obj;
    }, {} as Record<string, PlexServer>),
  }));
