import {
  Avatar,
  Container,
  Group,
  Header,
  Menu,
  Title,
  Transition,
  useMantineColorScheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fire, GearSix, MoonStars, SignOut, Sun } from "phosphor-react";
import { CSSProperties } from "react";
import { useQueryClient } from "react-query";
import { usePlexProfiles } from "../lib/plex/hooks";
import { User } from "../lib/plex/models";
import { signOut, useBurningStore } from "../state/store";

const HEADER_HEIGHT = 84;

const useUser = () => {
  const userId = useBurningStore((state) => state.userId);
  const { data } = usePlexProfiles(true);
  return data?.users.filter((user) => user.uuid === userId).at(0);
};

export default function Topbar() {
  const user = useUser();

  return (
    <Header height={HEADER_HEIGHT}>
      <Container
        className={`flex h-[${HEADER_HEIGHT}px] items-center justify-between`}
      >
        <Link href={user ? "/dashboard" : "/"}>
          <Group className="cursor-pointer rounded-md hover:underline">
            <Fire size={34} weight="bold" />
            <Title order={1}>Burning</Title>
          </Group>
        </Link>

        <Transition
          transition="fade"
          exitDuration={1000}
          duration={500}
          mounted={!!user}
        >
          {(style) => <UserMenu user={user} style={style} />}
        </Transition>

        {/* <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          className="sm:hidden"
          size="sm"
        /> */}
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
  const queryClient = useQueryClient();

  const onSignOut = () => {
    signOut();
    queryClient.removeQueries("plex");
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
