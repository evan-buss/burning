import { Card, Container, Title } from "@mantine/core";
import { LibrarySelector } from "../components/LibrarySelector";
import { Directory, PlexServer } from "../lib/plex/plex.model";
import { useGetResources } from "../lib/plex/plex.service";
import { useCardStyles } from "../lib/styles";
import { trpc } from "../utils/trpc";

export default function Settings() {
  const { classes } = useCardStyles();
  const { data: resources } = useGetResources();

  const toggleLibrary = trpc.useMutation("library.toggle");
  const handleToggle = async (server: PlexServer, directory: Directory) => {
    console.log("handlingToggle?");
    await toggleLibrary.mutateAsync({
      key: directory.key,
      server: server.clientIdentifier,
      uuid: directory.uuid,
    });
  };

  return (
    <Container size="lg" py="xl">
      <Card withBorder radius="md" p="xl" className={classes.card}>
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
