import { Button, Card, Container, Title } from "@mantine/core";
import { useState } from "react";
import {
  LibrarySelector,
  SelectableDirectory,
} from "../components/LibrarySelector";
import { useGetResources } from "../lib/plex/plex.service";
import { useCardStyles } from "../lib/styles";
import { trpc } from "../utils/trpc";

export default function Settings() {
  const { classes } = useCardStyles();
  const { data: resources } = useGetResources();
  const [choices, setChoices] = useState<SelectableDirectory[]>([]);

  const save = trpc.useMutation(["library.update"]);

  const handleClick = async () => {
    await save.mutateAsync(
      choices.map((c) => ({ uuid: c.uuid, address: c.connection, key: c.key }))
    );
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
            server={resource}
            setChoices={setChoices}
          />
        ))}

        <Button
          variant="outline"
          mt="md"
          onClick={handleClick}
          loading={save.isLoading}
        >
          Save
        </Button>
      </Card>
    </Container>
  );
}
