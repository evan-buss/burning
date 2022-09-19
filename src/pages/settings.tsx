import { Card, Title } from "@mantine/core";
import {
  LibrarySelector,
  SelectableDirectory,
} from "../components/LibrarySelector";
import { usePlexServers } from "../lib/plex/hooks";
import { PlexServer } from "../lib/plex/models";
import { trpc } from "../utils/trpc";

export default function Settings() {
  const { data: resources } = usePlexServers();
  const toggleLibrary = trpc.useMutation("library.toggle");

  const handleToggle = async (
    server: PlexServer,
    directory: SelectableDirectory
  ) => {
    await toggleLibrary.mutateAsync({
      key: directory.key,
      server: server.clientIdentifier,
      uuid: directory.uuid,
      mode: directory.checked ? "on" : "off",
    });
  };

  return (
    <>
      <Card withBorder radius="md" p="xl" mb="xl">
        <Title order={2} mb="md">
          Switch Profile
        </Title>
      </Card>

      <Card withBorder radius="md" p="xl" mb="xl">
        <Title order={2} mb="md">
          Choose Your Plex Libraries
        </Title>

        {resources?.map((resource) => (
          <LibrarySelector
            key={resource.clientIdentifier}
            mode="update"
            onToggle={(directory) => handleToggle(resource, directory)}
            server={resource}
          />
        ))}
      </Card>
    </>
  );
}
