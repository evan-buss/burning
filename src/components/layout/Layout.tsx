import {
  Avatar,
  Container,
  Menu,
  Transition,
  useMantineColorScheme
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";
import { GearSix, MoonStars, SignOut, Sun } from "phosphor-react";
import React, { CSSProperties } from "react";
import { useQueryClient } from "react-query";
import { usePlexProfiles } from "../../lib/plex/hooks";
import { User } from "../../lib/plex/models";
import { resetUserState, useBurningStore } from "../../state/store";
import { trpc } from "../../utils/trpc";
import Topbar from "../Topbar";

const useUser = () => {
  const userId = useBurningStore((state) => state.userId);
  const { data } = usePlexProfiles(!!userId);
  return data?.users?.filter((user) => user.uuid === userId).at(0);
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useUser();

  return (
    <>
      <Topbar>
        <Transition
          transition="fade"
          exitDuration={1000}
          duration={500}
          mounted={!!user}
        >
          {(style) => <UserMenu user={user} style={style} />}
        </Transition>
      </Topbar>

      <Container size="lg">{children}</Container>
    </>
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
  const signOut = trpc.useMutation(["user.signOut"]);

  const onSignOut = async () => {
    resetUserState();
    await signOut.mutateAsync();
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
