import { Button, Card, Text, Title } from "@mantine/core";
import { Directory } from "../../lib/plex/plex.model";
import { useGetResources } from "../../lib/plex/plex.service";
import { useCardStyles } from "../../lib/styles";
import { LibrarySelector } from "../LibrarySelector";

interface SelectLibrariesStepProps {
  done: () => void;
  setLibraries: (library: Directory[]) => void;
}

export default function SelectLibrariesStep({
  done,
  setLibraries,
}: SelectLibrariesStepProps) {
  const { classes } = useCardStyles();

  const { data: servers } = useGetResources();

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
        <LibrarySelector
          setChoices={setLibraries}
          key={server.clientIdentifier}
          server={server}
        />
      ))}

      <Button onClick={() => done()} variant="outline" mt="md">
        Done
      </Button>
    </Card>
  );
}
