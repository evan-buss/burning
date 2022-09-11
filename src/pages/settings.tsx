import { Card, Container, Title } from "@mantine/core";
import {
  LibrarySelector,
  SelectableDirectory,
} from "../components/LibrarySelector";
import { PlexServer } from "../lib/plex/plex.model";
import { useGetResources } from "../lib/plex/plex.service";
import { trpc } from "../utils/trpc";

export default function Settings() {
  const { data: resources } = useGetResources();
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
    <Container>
      <Card
        withBorder
        radius="md"
        p="xl"
        className="mx-0 overflow-auto sm:m-xl"
      >
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
    </Container>
  );
}
