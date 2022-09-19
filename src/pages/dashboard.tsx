import {
  Button,
  Card,
  Group,
  Image,
  ScrollArea,
  Skeleton,
  Stack,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import type { Library } from "@prisma/client";
import { usePlexLibrary, usePlexServers } from "../lib/plex/hooks";
import { trpc } from "../utils/trpc";

export default function Dashboard() {
  const { data: libraries } = trpc.useQuery(["library.get"]);
  const { data: servers } = usePlexServers();

  return (
    <>
      {servers &&
        libraries?.map((library) => (
          <LibrarySection key={library.key} library={library} />
        ))}
    </>
  );
}

function LibrarySection({ library }: { library: Library }) {
  const { data, isLoading, server } = usePlexLibrary(
    library.serverUUID,
    library.key
  );

  return (
    <Card p="xl" mb="xl" className="overflow-auto" withBorder>
      {isLoading ? (
        <Stack>
          <Skeleton height={36} width="25%" animate={false} />
          <div className="relative flex flex-row gap-2 overflow-hidden rounded-md">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton
                key={index}
                height={160}
                width={120}
                radius="md"
                animate={false}
              ></Skeleton>
            ))}
          </div>
        </Stack>
      ) : (
        <>
          <Group position="apart">
            <Title order={3}>{data?.title1}</Title>
            <Button
              component={NextLink}
              href={`/voting/${library.uuid}`}
              variant="outline"
              size="xs"
              className="h-xl"
            >
              Vote
            </Button>
          </Group>

          <ScrollArea>
            <div className="relative flex flex-row gap-2 overflow-auto rounded-md mt-md pb-sm">
              {data?.Metadata?.slice(0, 10).map((media) => (
                <Image
                  key={media.key}
                  height={160}
                  width="auto"
                  fit="contain"
                  radius="md"
                  className="select-none"
                  alt={`${media.title} thumbnail`}
                  src={`${server.preferredConnection}${media.thumb}?X-Plex-Token=${server.accessToken}`}
                />
              )) ?? []}
            </div>
          </ScrollArea>
        </>
      )}
    </Card>
  );
}
