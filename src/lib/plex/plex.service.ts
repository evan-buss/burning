import axios from "axios";
import { useQuery } from "react-query";
import { useAuthState } from "../../state/auth.store";
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
    ["plex", "home-users"],
    () => getHomeUsers(accessToken, clientId),
    {
      enabled: enabled && !!accessToken,
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

export function useGetUserInfo(enabled = true) {
  const accessToken = useAuthState((state) => state.accessToken!);
  const clientId = useAuthState((state) => state.clientId);

  return useQuery(["plex", "user"], () => getUserInfo(accessToken, clientId), {
    enabled,
  });
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
    server.preferredConnection = connection.uri;
  }

  return data;
}

export function useGetResources() {
  const accessToken = useAuthState((state) => state.accessToken!);
  const clientId = useAuthState((state) => state.clientId);

  return useQuery(
    ["plex", "resources"],
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

  const container = data.MediaContainer as MediaContainer;

  // Store the token / URL so it's easily accessible.
  for (const directory of container.Directory) {
    directory.accessToken = accessToken;
    directory.connection = serverAddress;
  }

  return container;
}

export function useGetServerLibraries(
  serverAddress: string,
  accessToken: string,
  onSuccess?: (data: MediaContainer) => void
) {
  const clientId = useAuthState((state) => state.clientId);

  return useQuery(
    ["plex, libraries", serverAddress],
    () => getServerLibraries(serverAddress, accessToken, clientId),
    {
      onSuccess,
    }
  );
}

export async function getLibrary(
  serverAddress: string,
  accessToken: string,
  clientId: string,
  libraryKey: string
): Promise<MediaContainer> {
  const { data } = await axios.get(
    `${serverAddress}/library/sections/${libraryKey}/all`,
    {
      headers: {
        accept: "application/json",
        "X-Plex-Token": accessToken,
        "X-Plex-Client-Identifier": clientId,
      },
      params: {
        type: 1,
        // ...searchParams,
        sort: "titleSort",
        "X-Plex-Token": accessToken,
      },
    }
  );

  return data.MediaContainer;
}

export async function useGetLibrary(
  serverAddress: string,
  accessToken: string,
  libraryKey: string
) {
  const clientId = useAuthState((state) => state.clientId);

  return useQuery(["plex", "libraries", serverAddress, libraryKey], () =>
    getLibrary(serverAddress, accessToken, clientId, libraryKey)
  );
}
