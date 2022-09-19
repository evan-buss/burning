import {
  ActionIcon,
  Badge,
  Group,
  Image,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Info, Star, UserCircle } from "phosphor-react";
import { useState } from "react";
import VoteCard from "../../components/voting/VoteCard";
import { usePlexAccount, usePlexLibrary } from "../../lib/plex/hooks";
import { AccountInfo, PlexContentMetadata } from "../../lib/plex/models";
import { useBurningStore } from "../../state/store";

const randomRotation = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function VotePage() {
  const router = useRouter();
  const { libraryId } = router.query;

  const library = useBurningStore(
    (state) => state.libraries.byUUID[libraryId as string]
  );
  const servers = useBurningStore((x) => x.servers.byUUID);

  const { data, isLoading } = usePlexLibrary(
    (Object.values(servers)[0] as any).clientIdentifier,
    library?.key ?? "",
    (data) => setItems(data.Metadata.slice(0, 10))
  );

  console.log(data);

  const [items, setItems] = useState<PlexContentMetadata[]>([]);

  const { data: account } = usePlexAccount(true);

  const handleVote = (item: PlexContentMetadata, vote: boolean) => {
    setItems((items) => items.filter((x) => x.ratingKey !== item.ratingKey));
    console.log("vote", vote);
  };

  return (
    <>
      <Title order={2}>{library?.title}</Title>
      <div className="flex items-center justify-center w-full h-full overflow-hidden">
        <AnimatePresence>
          {items?.map((item, i) => (
            <MovieCard
              key={item.ratingKey}
              item={item}
              draggable={i === items.length - 1}
              onVote={(vote) => handleVote(item, vote)}
              account={account}
              library={library}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function MovieCard({
  item,
  draggable,
  onVote,
  account,
  library,
}: {
  item: PlexContentMetadata;
  draggable: boolean;
  onVote: (vote: boolean) => void;
  account?: AccountInfo;
  library?: { connection: string; accessToken: string };
}) {
  const [info, setInfo] = useState(false);
  const [transform] = useState(`rotate(${randomRotation(-5, 5)}deg)`);
  const theme = useMantineTheme();

  return (
    <VoteCard draggable={draggable} onVote={onVote}>
      <motion.div style={{ transform }} className="relative flex flex-row">
        <div className="relative h-[310px] w-[210px] rounded-md">
          <Image
            className="object-fill rounded-md"
            fit="contain"
            alt="movie poster"
            radius="md"
            imageProps={{ draggable: false }}
            src={`${library?.connection}${item.thumb}?X-Plex-Token=${library?.accessToken}`}
          />

          <ActionIcon
            size="lg"
            color="yellow"
            variant="outline"
            className="absolute bottom-4 right-4"
            onClick={() => setInfo((curr) => !curr)}
          >
            <Info size={24} />
          </ActionIcon>
        </div>

        <motion.div
          animate={info ? "active" : "initial"}
          variants={{
            initial: {
              display: "none",
              left: 0,
              top: 0,
              opacity: 0,
            },
            active: {
              left: 220,
              top: 0,
              display: "block",
              opacity: 1,
            },
          }}
          className={clsx(
            "absolute -z-10 flex w-[300px] flex-col justify-between rounded-md bg-white p-md dark:bg-dark-5",
            draggable && "shadow-lg"
          )}
        >
          <div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                {item.Genre?.map((genre) => (
                  <Badge
                    key={genre.tag}
                    color={theme.colorScheme === "dark" ? "dark" : "gray"}
                  >
                    {genre.tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-row items-center justify-center gap-1">
                <Text size="sm">{item.audienceRating}</Text>
                <Star size={18} weight="fill" className="text-yellow-5" />
              </div>
            </div>
            <Title order={3} className="leading-tight grow" mt="xs" mb="md">
              {item.title}
            </Title>
          </div>

          <Text
            className="flex-1 leading-none whitespace-pre-wrap grow"
            color="dimmed"
            lineClamp={4}
            size="sm"
          >
            {item.summary}
          </Text>

          {/* <Group noWrap spacing="xs" mt="md"> */}
          <div className="flex justify-between mt-md flex-nowrap">
            <Group spacing="xs" noWrap>
              <UserCircle size={20} />
              <Text size="xs">{item.Director?.at(0)?.tag}</Text>
            </Group>
            <Text size="xs" color="dimmed">
              {item.year}
            </Text>
          </div>
          {/* </Group> */}
        </motion.div>
      </motion.div>
    </VoteCard>
  );
}
