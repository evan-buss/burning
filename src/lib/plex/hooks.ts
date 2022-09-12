import { useQuery } from "react-query";
import { useBurningStore, usePlexCredentials } from "../../state/store";
import {
  getLibrary,
  getPlexProfiles,
  getPlexServers,
  getPlexServerLibraries,
  getUserInfo,
} from "./api";
import { MediaContainer, PlexServer } from "./models";

// Get account details for the signin in user.
export function usePlexAccount(enabled: boolean) {
  const { accessToken, clientId } = usePlexCredentials();

  return useQuery(["plex", "user"], () => getUserInfo(accessToken!, clientId), {
    enabled: enabled && !!accessToken,
  });
}

// Get all users of a Plex account.
// If Plex Home is enabled this could be a list of different Home Users
// that all share the same user / password login credentials.
// If just a single user account it will return an array with a single user.
export function usePlexProfiles(enabled: boolean) {
  const { accessToken, clientId } = usePlexCredentials();

  return useQuery(
    ["plex", "home-users"],
    () => getPlexProfiles(accessToken!, clientId),
    {
      enabled: enabled && !!accessToken,
    }
  );
}

export function usePlexServers(onSuccess?: (servers: PlexServer[]) => void) {
  const { accessToken, clientId } = usePlexCredentials();

  return useQuery(
    ["plex", "resources"],
    () => getPlexServers(accessToken!, clientId),
    {
      staleTime: 1_000 * 60 * 5,
      onSuccess,
      enabled: !!accessToken,
    }
  );
}

export function usePlexLibraries(
  serverId: string,
  onSuccess?: (data: MediaContainer) => void
) {
  const { clientId } = usePlexCredentials();
  const server = useBurningStore((x) => x.servers.byUUID[serverId]);

  console.log("server:", serverId, "accessToken", server?.accessToken);

  if (!server) throw new Error(`unable to find server ${serverId}`);

  return useQuery(
    ["plex, libraries", serverId],
    () =>
      getPlexServerLibraries(
        server.preferredConnection,
        server.accessToken,
        clientId
      ),
    {
      onSuccess,
    }
  );
}

export function usePlexLibrary(serverId: string, libraryKey: string) {
  const { clientId } = usePlexCredentials();
  const server = useBurningStore((x) => x.servers.byUUID[serverId]);

  console.log("server:", serverId, "accessToken", server?.accessToken);
  if (!server) throw new Error(`unable to find server ${serverId}`);

  const query = useQuery(["plex", "libraries", serverId, libraryKey], () =>
    getLibrary(
      server.preferredConnection,
      server.accessToken,
      clientId,
      libraryKey
    )
  );

  return { ...query, server };
}
