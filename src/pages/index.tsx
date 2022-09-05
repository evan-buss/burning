import { Button, Container, createStyles, Group, Text } from "@mantine/core";
import Link from "next/link";

const BREAKPOINT = "@media (max-width: 755px)";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    // position: "relative",
    // paddingTop: 200,
    // paddingBottom: 120,
    // [BREAKPOINT]: {
    //   paddingBottom: 80,
    //   paddingTop: 80,
    // },
  },

  title: {
    fontFamily: `${theme.headings.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

export default function HeroTitle() {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          A{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "yellow", to: "gray" }}
            inherit
          >
            quick
          </Text>{" "}
          way to decide on your next movie.
        </h1>

        <Text className={classes.description} color="dimmed">
          Take the hassle out of movie night. Sign in with your Plex account and
          select the movies you&apos;re interested in.
          <Text weight="bold">We&apos;ll handle the rest.</Text>
        </Text>

        <Group className={classes.controls} position="center">
          <Link href="/setup" passHref>
            <Button
              component="a"
              size="xl"
              className={classes.control}
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
            className={classes.control}
          >
            GitHub
          </Button>
        </Group>
        {/* <Image src={Campfire} /> */}
      </Container>
    </div>
  );
}
