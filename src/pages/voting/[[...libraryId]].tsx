import { Title } from "@mantine/core";
import { useRouter } from "next/router";
import { Stack } from "../../components/Stack";
import { usePlexLibrary } from "../../lib/plex/hooks";
import { useBurningStore } from "../../state/store";

export default function VotePage() {
  const router = useRouter();
  const { libraryId } = router.query;

  const library = useBurningStore(
    (state) => state.libraries.byUUID[libraryId as string]
  );
  console.log(library);
  const servers = useBurningStore((x) => x.servers.byUUID);

  const { data, isLoading } = usePlexLibrary(
    (Object.values(servers)[0] as any).clientIdentifier,
    library?.key ?? ""
  );

  return (
    <>
      <Title order={2}>{library?.title}</Title>
      <Stack onVote={(item, vote) => console.log((item as any).props, vote)}>
        {data?.Metadata.slice(0, 1).map((content) => (
          <img
            key={content.key}
            data-value={content.key}
            className="flex items-center justify-center rounded-md bg-[#f9fafb] text-[80px] shadow"
            style={{
              transform: `rotate(${Math.random() * (5 - -5) + -5}deg)`,
            }}
            height={500}
            width="auto"
            alt={`${content.title} thumbnail`}
            src={`${library?.connection}${content.thumb}?X-Plex-Token=${library?.accessToken}`}
          />
        ))}
      </Stack>
    </>
  );
}
