import { Button, Card, Group, Image, Loader, Title } from "@mantine/core";
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
  console.log("Library", library);
  const { data, isLoading, server } = usePlexLibrary(
    library.serverUUID,
    library.key
  );

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <Card className="mx-0 overflow-auto sm:m-xl" withBorder>
      <Group position="apart">
        <Title order={3}>{data?.title1}</Title>
        <Button
          component={NextLink}
          href={`/voting/${library.uuid}`}
          variant="outline"
          size="xs"
          className="h-xl"
        >
          Review
        </Button>
      </Group>

      <div className="relative mt-md flex flex-row gap-2 overflow-auto rounded-md">
        {/* <Overlay
          radius="md"
          opacity={0.2}
          zIndex={5}

        ></Overlay> */}
        {data?.Metadata?.slice(0, 10).map((media) => (
          <Image
            key={media.key}
            onClick={() => alert("clicked")}
            height={160}
            width="auto"
            fit="contain"
            radius="md"
            alt={`${media.title} thumbnail`}
            src={`${server.preferredConnection}${media.thumb}?X-Plex-Token=${server.accessToken}`}
          />
        )) ?? []}
      </div>
    </Card>
  );
}
