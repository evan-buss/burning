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
import { useGetHomeUsers, useGetUserInfo } from "../../lib/plex/plex.service";
import { useCardStyles } from "../../lib/styles";
import { setUserId, useAuthState } from "../../state/auth.store";
import { trpc } from "../../utils/trpc";

export default function ProfileStep({ done }: StepProps) {
  const { classes } = useCardStyles();
  const { replace } = useRouter();
  const { data: account, isLoading: accountLoading } = useGetUserInfo();
  const { data: homeUsers, isLoading: usersLoading } = useGetHomeUsers(
    !!account
  );
  const userId = useAuthState((state) => state.userId);
  const accessToken = useAuthState((state) => state.accessToken);

  const { data: user } = useGetUserInfo(!!accessToken);
  const { data: existingUser, isSuccess } = trpc.useQuery(
    ["user.findUser", userId!],
    {
      enabled: !!userId,
    }
  );

  const signIn = trpc.useMutation(["user.signIn"]);
  const handleSignIn = async () => {
    if (!userId) throw new Error("attempting signIn with undefined user UUID");
    await signIn.mutateAsync(userId);
    replace("/dashboard");
  };

  const signUp = trpc.useMutation(["user.signUp"]);
  const handleSignUp = async () => {
    if (!user) throw new Error("attempting signUp with undefined plex user");
    await signUp.mutateAsync({
      uuid: user.uuid,
      email: user.email,
      username: user.username,
    });
    done();
  };

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
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
