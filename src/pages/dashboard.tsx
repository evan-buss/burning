import {
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  Title,
} from "@mantine/core";
import type { Library, Server } from "@prisma/client";
import { useGetLibrary, useGetResources } from "../lib/plex/plex.service";
import { usePlexState } from "../state/plex.store";
import { trpc } from "../utils/trpc";

export default function Dashboard() {
  const { data: libraries } = trpc.useQuery(["library.get"]);
  const { data: resources } = useGetResources();

  return (
    <Container>
      {resources &&
        libraries?.map((library) => (
          <LibrarySection key={library.key} library={library} />
        ))}
    </Container>
  );
}

function LibrarySection({
  library,
}: {
  library: Library & { server: Server };
}) {
  const accessToken = usePlexState(
    (x) => x.byUUID[library.serverUUID]?.accessToken
  );

  const servers = usePlexState((x) => x.byUUID);

  console.log("servers", servers);

  if (!accessToken) throw new Error("don't have token for that server....");

  const { data, isLoading } = useGetLibrary(
    library.server.address,
    accessToken,
    library.key
  );
  data && console.log(data);

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <Card className="mx-0 overflow-auto sm:m-xl" withBorder>
      <Group position="apart">
        <Title order={3}>{data?.title1}</Title>
        <Button variant="outline" size="xs" className="h-xl">
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
            onClick={() => alert("clicked")}
            height={160}
            width="auto"
            fit="contain"
            radius="md"
            alt={`${media.title} thumbnail`}
            key={media.key}
            src={`${library.server.address}${media.thumb}?X-Plex-Token=${accessToken}`}
          />
        )) ?? []}
      </div>
    </Card>
  );
}
