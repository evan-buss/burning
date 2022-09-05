import { Button, Card, Checkbox, Text, Title } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect } from "react";
import { MediaContainer, PlexServer } from "../../lib/plex.model";
import { useGetResources, useGetServerLibraries } from "../../lib/plex.service";
import { useCardStyles } from "./setup-utils";

interface SelectLibrariesStepProps {
  done: () => void;
}

export default function SelectLibrariesStep({
  done,
}: SelectLibrariesStepProps) {
  const { classes } = useCardStyles();

  const { data: servers, isLoading } = useGetResources();

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

      {isLoading ? (
        <h1>Loading</h1>
      ) : (
        servers?.map((server) => (
          <LibrarySelection key={server.clientIdentifier} server={server} />
        ))
      )}

      <Button onClick={() => done()} variant="outline" mt="md">
        Done
      </Button>
    </Card>
  );
}

interface LibraryOption {
  label: string;
  checked: boolean;
  key: string;
}

function convertMediaContainer(container: MediaContainer | undefined) {
  return (
    container?.Directory.map(
      (library) =>
        ({
          label: library.title,
          checked: false,
          key: library.uuid,
        } as LibraryOption)
    ) ?? []
  );
}

export function LibrarySelection({ server }: { server: PlexServer }) {
  const [values, handlers] = useListState<LibraryOption>([]);
  const { data } = useGetServerLibraries(
    server.connectionUrl,
    server.accessToken
  );

  useEffect(() => {
    handlers.setState(convertMediaContainer(data));
  }, [data]);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values?.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={(event) =>
        handlers.setItemProp(index, "checked", event.currentTarget.checked)
      }
    />
  ));

  return (
    <>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label={server.name}
        transitionDuration={0}
        onChange={() =>
          handlers.setState((current) =>
            current.map((value) => ({ ...value, checked: !allChecked }))
          )
        }
      />
      {items}
    </>
  );
}
