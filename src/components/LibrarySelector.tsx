import { Checkbox } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Directory, PlexServer } from "../lib/plex/plex.model";
import { useGetServerLibraries } from "../lib/plex/plex.service";

export interface SelectableDirectory extends Directory {
  checked: boolean;
}

export function LibrarySelector({
  server,
  setChoices,
}: {
  server: PlexServer;
  setChoices: (servers: SelectableDirectory[]) => void;
}) {
  const [values, handlers] = useListState<SelectableDirectory>([]);
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
        handlers.setState((current) => {
          setChoices(current.filter((x) => x.checked));
          return current;
        });
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
          handlers.setState((current) => {
            const selected = current.map((value) => ({
              ...value,
              checked: !allChecked,
            }));
            setChoices(selected.filter((x) => x.checked));
            return selected;
          });
        }}
      />
      {items}
    </>
  );
}
