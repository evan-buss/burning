import { Button, Container, Group, Text, Title } from "@mantine/core";
import Link from "next/link";
import { ReactElement } from "react";
import AnonLayout from "../components/layout/AnonLayout";

export default function HomePage() {
  return (
    <div className="flex h-full items-center justify-center">
      <section>
        <Title
          order={1}
          weight={900}
          className="m-0 py-[20px] text-[48px] leading-[1.1] text-black dark:text-white sm:py-0 sm:text-[62px]"
        >
          A{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "yellow.8", to: "yellow.5" }}
            inherit
          >
            quick
          </Text>{" "}
          way to decide on your next movie.
        </Title>

        <Text className="mt-xl text-lg sm:text-xl" color="dimmed">
          Take the hassle out of movie night. Sign in with your Plex account and
          select the movies you&apos;re interested in.{" "}
          <Text weight={550} span>
            We&apos;ll handle the rest.
          </Text>
        </Text>

        <Group className="mt-xl sm:mt-2xl" position="center">
          <Link href="/setup" passHref>
            <Button
              component="a"
              size="xl"
              className="h-14 flex-1 px-9 sm:flex-initial"
              variant="filled"
              color="yellow"
            >
              Get started
            </Button>
          </Link>

          <Button
            component="a"
            href="https://github.com/evan-buss/burning"
            size="xl"
            variant="default"
            className="h-14 flex-1 px-9 sm:flex-initial"
          >
            GitHub
          </Button>
          {/* <Image src={Campfire} /> */}
        </Group>
      </section>
    </div>
  );
}

HomePage.getLayout = (page: ReactElement) => {
  return <AnonLayout>{page}</AnonLayout>;
};
