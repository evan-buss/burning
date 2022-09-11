import { Checkbox } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Directory, PlexServer } from "../lib/plex/plex.model";
import { useGetServerLibraries } from "../lib/plex/plex.service";
import { trpc } from "../utils/trpc";
import { sleep } from "../utils/utils";

export interface SelectableDirectory extends Directory {
  checked: boolean;
}

export function LibrarySelector({
  server,
  onToggle,
  mode = "create",
}: {
  server: PlexServer;
  onToggle: (directory: SelectableDirectory) => void;
  mode?: "create" | "update";
}) {
  const [values, handlers] = useListState<SelectableDirectory>([]);

  // Load all libraries for the server, keeping
  const { data: libraries } = useGetServerLibraries(
    server.preferredConnection,
    server.accessToken,
    ({ Directory: directory }) => {
      handlers.setState(
        directory.map(
          (dir) =>
            ({
              ...dir,
              checked: values.find((x) => x.uuid === dir.uuid)?.checked,
            } as SelectableDirectory)
        ) ?? []
      );
    }
  );

  trpc.useQuery(["library.get"], {
    enabled: mode === "update" && !!libraries,
    onSuccess: (libraries) => {
      handlers.setState((items) =>
        items.map((value) => {
          return {
            ...value,
            checked: !!libraries.find((x) => x.uuid === value.uuid),
          };
        })
      );
    },
  });

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const toggleAll = async () => {
    handlers.setState((current) =>
      current.map((value) => ({
        ...value,
        checked: !allChecked,
      }))
    );

    for (const directory of values.filter((x) => x.checked !== !allChecked)) {
      // HACK: SQLITE issues receiving too many write requests...
      await sleep(50);
      onToggle({ ...directory, checked: !allChecked });
    }
  };

  const items = values?.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.title}
      key={value.key}
      checked={value.checked}
      onChange={(event) => {
        onToggle({ ...value, checked: !value.checked });
        handlers.setItemProp(index, "checked", event.currentTarget.checked);
      }}
    />
  ));

  return (
    <>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label={server.name}
        onChange={toggleAll}
      />
      {items}
    </>
  );
}
