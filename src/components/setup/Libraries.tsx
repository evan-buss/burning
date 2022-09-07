import { Button, Card, Text, Title } from "@mantine/core";
import { StepProps } from ".";
import { Directory, PlexServer } from "../../lib/plex/plex.model";
import { useGetResources } from "../../lib/plex/plex.service";
import { useCardStyles } from "../../lib/styles";
import { trpc } from "../../utils/trpc";
import { LibrarySelector } from "../LibrarySelector";

export default function SelectLibrariesStep({ done }: StepProps) {
  const { classes } = useCardStyles();

  const upsertServers = trpc.useMutation("library.upsertServers");
  const { data: servers } = useGetResources(async (servers) => {
    await upsertServers.mutateAsync(
      servers.map((server) => ({
        address: server.preferredConnection,
        uuid: server.clientIdentifier,
        name: server.name,
      }))
    );
  });

  const handleDone = () => {
    done();
  };

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Title order={2} mb="md">
        Choose Your Plex Libraries
      </Title>
      <Text size="md" color="dimmed" mt={3} mb="xl">
        Each Plex account has access to one or more content servers. Select the
        servers and libraries that you use. We&apos;ll let you vote on the
        content within them.
      </Text>

      {servers?.map((server) => (
        <LibrarySelectorWrapper key={server.clientIdentifier} server={server} />
      ))}

      <Button onClick={handleDone} variant="outline" mt="md">
        Done
      </Button>
    </Card>
  );
}

export function LibrarySelectorWrapper({ server }: { server: PlexServer }) {
  const toggleLibrary = trpc.useMutation("library.toggle");
  const handleToggle = async (directory: Directory) => {
    console.log("handlingToggle?");
    await toggleLibrary.mutateAsync({
      key: directory.key,
      server: server.clientIdentifier,
      uuid: directory.uuid,
    });
  };

  return (
    <LibrarySelector
      onToggle={handleToggle}
      key={server.clientIdentifier}
      server={server}
    />
  );
}
