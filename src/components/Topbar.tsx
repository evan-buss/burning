import {
  Avatar,
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  Menu,
  Title,
  Transition,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fire, GearSix, MoonStars, SignOut, Sun } from "phosphor-react";
import { CSSProperties } from "react";
import { User } from "../lib/plex.model";
import { useGetHomeUsers } from "../lib/plex.service";
import { signOut, useAuthState } from "../state/auth.store";

const HEADER_HEIGHT = 84;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  links: {
    paddingTop: theme.spacing.lg,
    height: HEADER_HEIGHT,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

const useUser = () => {
  const userId = useAuthState((state) => state.userId);
  const { data } = useGetHomeUsers(true);
  return data?.users.filter((user) => user.id === userId).at(0);
};

export default function Topbar() {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const user = useUser();

  console.log("user", user);

  return (
    <Header height={HEADER_HEIGHT}>
      <Container className={classes.inner}>
        <Link href="/">
          <Group className={classes.logo}>
            <Fire size={34} weight="bold" />
            <Title order={1}>Burning</Title>
          </Group>
        </Link>

        <Transition transition="fade" duration={500} mounted={!!user}>
          {(style) => <UserMenu user={user} style={style} />}
        </Transition>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
      </Container>
    </Header>
  );
}

function UserMenu({
  style,
  user,
}: {
  style: CSSProperties;
  user: User | undefined;
}) {
  const { replace } = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const onSignOut = () => {
    signOut();
    replace("/");
  };

  return (
    <Menu trigger="hover" shadow="md" width={200}>
      <Menu.Target>
        <Avatar
          style={style}
          styles={{
            image: {
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            },
          }}
          src={user?.thumb}
          radius={40}
        ></Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<GearSix size={14} weight="bold" />}
          component={NextLink}
          href="/settings"
        >
          Settings
        </Menu.Item>
        <Menu.Item
          icon={
            colorScheme === "dark" ? (
              <Sun size={14} weight="bold" />
            ) : (
              <MoonStars size={14} weight="bold" />
            )
          }
          onClick={() => toggleColorScheme()}
        >
          Toggle Theme
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          icon={<SignOut size={14} weight="bold" />}
          onClick={() => onSignOut()}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
