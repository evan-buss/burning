import { Card, Container, Title } from "@mantine/core";
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

  const [choices, setChoices] = useState<SelectableDirectory[]>([]);
  const { data: user } = trpc.useQuery(["user.me"]);
  trpc.useQuery(["library.selected"], {
    onSuccess: (libraries) =>
      setChoices((choices) =>
        choices.map((choice) => {
          const exists = !!libraries.find((x) => x.uuid === choice.uuid);
          console.log(exists);
          choice.checked = exists ? exists : choice.checked;
          return choice;
        })
      ),
  });

  const { data: resources } = useGetResources();

  return (
    <Container size="lg" py="xl">
      <Card withBorder radius="md" p="xl" className={classes.card}>
        <Title order={2} mb="md">
          Choose Your Plex Libraries
        </Title>

        {resources?.map((resource) => (
          <LibrarySelector
            key={resource.clientIdentifier}
            server={resource}
            setChoices={setChoices}
          />
        ))}
      </Card>
    </Container>
  );
}
