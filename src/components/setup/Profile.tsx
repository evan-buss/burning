import {
  Avatar,
  Button,
  Card,
  Group,
  Select,
  SelectItem,
  SelectItemProps,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { forwardRef } from "react";
import { StepProps } from ".";
import { usePlexAccount, usePlexProfiles } from "../../lib/plex/hooks";
import { setUserId, useBurningStore } from "../../state/store";
import { trpc } from "../../utils/trpc";

export default function ProfileStep({ done }: StepProps) {
  const { replace } = useRouter();

  const userId = useBurningStore((state) => state.userId);
  const accessToken = useBurningStore((state) => state.accessToken);

  const { data: account } = usePlexAccount(!!userId);
  const { data: homeUsers, isLoading: usersLoading } = usePlexProfiles(
    !!account
  );

  const { data: user } = usePlexAccount(!!accessToken);
  const { data: existingUser, isSuccess } = trpc.useQuery(
    ["user.findUser", userId],
    {
      enabled: !!userId,
    }
  );

  const signIn = trpc.useMutation(["user.signIn"]);
  const handleSignIn = async () => {
    console.log("user", user);
    if (!userId) throw new Error("attempting signIn with undefined user UUID");
    await signIn.mutateAsync(userId);
    replace("/dashboard");
  };

  const signUp = trpc.useMutation(["user.signUp"]);
  const handleSignUp = async () => {
    const homeUser = homeUsers?.users.find((x) => x.uuid === userId);

    if (!user) throw new Error("unable to load user's account");
    if (!homeUser) throw new Error("unable to find the selected home user");

    console.log("homeUser", homeUser);

    await signUp.mutateAsync({
      uuid: homeUser.uuid,
      email: homeUser.email ?? user.email,
      username: homeUser.username ?? user.username,
    });
    done();
  };

  return (
    <Card withBorder radius="md" p="xl" className="mx-0 overflow-auto sm:m-xl">
      <Title order={2} mb="md">
        Pick Your Plex Profile
      </Title>
      <Text size="md" color="dimmed" mt={3} mb="xl">
        Choose the plex user you watch your content with. Choices you make will
        be associated with this account. If you are a Plex Home user, select
        your specific profile.
      </Text>

      {account && (
        <Select
          label="Select Profile"
          itemComponent={SelectItem}
          value={userId?.toString()}
          onChange={(value) => setUserId(value)}
          mt="xl"
          clearable={true}
          disabled={usersLoading}
          filter={(value, item) =>
            item.label?.toLowerCase().includes(value.toLowerCase().trim()) ??
            false
          }
          data={
            homeUsers?.users.map(
              (user) =>
                ({
                  value: user.uuid,
                  label: user.username ?? user.title,
                  thumb: user.thumb,
                  user,
                } as SelectItem)
            ) ?? []
          }
        />
      )}

      {isSuccess && existingUser ? (
        <>
          <Button mt="md" variant="outline" onClick={handleSignIn}>
            Sign In
          </Button>
        </>
      ) : (
        <Button mt="md" variant="outline" onClick={handleSignUp}>
          Next
        </Button>
      )}
    </Card>
  );
}

const SelectItem = forwardRef<
  HTMLDivElement,
  SelectItemProps & { thumb: string }
>(({ label, thumb, ...others }: SelectItemProps & { thumb: string }, ref) => (
  <Group
    ref={ref}
    {...others}
    noWrap
    sx={(theme) => ({ padding: theme.spacing.sm / 2 })}
  >
    <Avatar src={thumb} radius={40} size={24} />
    <Text size="sm">{label}</Text>
  </Group>
));

SelectItem.displayName = "SelectItem";
