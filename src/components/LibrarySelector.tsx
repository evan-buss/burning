import { Checkbox } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect } from "react";
import { Directory, PlexServer } from "../lib/plex/plex.model";
import { useGetServerLibraries } from "../lib/plex/plex.service";
import { trpc } from "../utils/trpc";

export interface SelectableDirectory extends Directory {
  checked: boolean;
}

export function LibrarySelector({
  server,
  setChoices,
  mode = "create",
}: {
  server: PlexServer;
  setChoices: (servers: SelectableDirectory[]) => void;
  mode?: "create" | "update";
}) {
  const [values, handlers] = useListState<SelectableDirectory>([]);
  console.log(server);

  trpc.useQuery(["library.get", server.clientIdentifier], {
    enabled: mode === "update",
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

  useGetServerLibraries(
    server.preferredConnection,
    server.accessToken,
    (data) => {
      const items =
        data?.Directory.map((dir) => {
          return {
            ...dir,
            // keep checked state of existing values
            checked: values.find((x) => x.uuid === dir.uuid)?.checked ?? false,
          } as SelectableDirectory;
        }) ?? [];
      handlers.setState(items);
    }
  );

  useEffect(() => {
    setChoices(values.filter((x) => x.checked));
  }, [values]);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values?.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.title}
      key={value.key}
      checked={value.checked}
      onChange={(event) => {
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
        onChange={() => {
          handlers.setState((current) =>
            current.map((value) => ({
              ...value,
              checked: !allChecked,
            }))
          );
        }}
      />
      {items}
    </>
  );
}
