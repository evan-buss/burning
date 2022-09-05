import axios from "axios";
import { useQuery } from "react-query";
import { useAuthState } from "../state/auth.store";
import {
  AccountInfo,
  MediaContainer,
  PlexServer,
  UsersRoot,
} from "./plex.model";

export async function getHomeUsers(
  accessToken: string,
  clientId: string
): Promise<UsersRoot> {
  const { data } = await axios.get("https://plex.tv/api/v2/home/users", {
    headers: {
      accept: "application/json",
      "X-Plex-Token": accessToken,
      "X-Plex-Client-Identifier": clientId,
    },
  });
  return data;
}

export function useGetHomeUsers(enabled: boolean) {
  const accessToken = useAuthState((state) => state.accessToken!);
  const clientId = useAuthState((state) => state.clientId);

  return useQuery(
    ["plex-home-users"],
    () => getHomeUsers(accessToken, clientId),
    {
      enabled,
    }
  );
}

export async function getUserInfo(
  accessToken: string,
  clientId: string
): Promise<AccountInfo> {
  const { data } = await axios.get("https://plex.tv/api/v2/user", {
    headers: {
      accept: "application/json",
      "X-Plex-Token": accessToken,
      "X-Plex-Client-Identifier": clientId,
    },
  });
  return data;
}

export function useGetUserInfo() {
  const accessToken = useAuthState((state) => state.accessToken!);
  const clientId = useAuthState((state) => state.clientId);

  return useQuery(["plex-user"], () => getUserInfo(accessToken, clientId));
}

export async function getResources(
  accessToken: string,
  clientId: string
): Promise<PlexServer[]> {
  const { data } = await axios.get(
    "https://plex.tv/api/v2/resources?includeHttps=1", //&includeRelay=1,
    {
      headers: {
        accept: "application/json",
        "X-Plex-Token": accessToken,
        "X-Plex-Client-Identifier": clientId,
      },
    }
  );

  // For each server, attempt connection, then store
  // the first successful connection for future use.
  for (const server of data as PlexServer[]) {
    const connection = await Promise.any(
      server.connections
        .filter((connection) => connection.protocol === "https")
        .map(async (connection) => {
          await axios.get(connection.uri, {
            timeout: 1_000,
            timeoutErrorMessage: "server ping timeout exceeded",
            headers: {
              accept: "application/json",
              "X-Plex-Token": server.accessToken,
              "X-Plex-Client-Identifier": clientId,
            },
          });

          return connection;
        })
    );

    console.log("prioritized server:", connection.uri);
    server.connectionUrl = connection.uri;
  }

  return data;
}

export function useGetResources() {
  const accessToken = useAuthState((state) => state.accessToken!);
  const clientId = useAuthState((state) => state.clientId);

  console.log(accessToken, clientId);

  return useQuery(
    ["plex-resources"],
    () => getResources(accessToken, clientId),
    {
      staleTime: 1_000 * 60 * 5,
    }
  );
}

export async function getServerLibraries(
  serverAddress: string,
  accessToken: string,
  clientId: string
): Promise<MediaContainer> {
  const { data } = await axios.get(`${serverAddress}/library/sections`, {
    headers: {
      accept: "application/json",
      "X-Plex-Token": accessToken,
      "X-Plex-Client-Identifier": clientId,
    },
  });

  return data.MediaContainer;
}

export function useGetServerLibraries(
  serverAddress: string,
  accessToken: string
) {
  const clientId = useAuthState((state) => state.clientId);

  return useQuery(["plex-libraries", serverAddress], () =>
    getServerLibraries(serverAddress, accessToken, clientId)
  );
}
