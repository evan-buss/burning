import {
  Avatar,
  Button,
  Card,
  Group,
  Select,
  SelectItem,
  SelectItemProps,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { forwardRef } from "react";
import { useGetHomeUsers, useGetUserInfo } from "../../lib/plex.service";
import { setUserId, useAuthState } from "../../state/auth.store";
import { useCardStyles } from "./setup-utils";

interface ProfileStepProps {
  done: () => void;
}

export default function ProfileStep({ done }: ProfileStepProps) {
  const { classes } = useCardStyles();
  const { data: account, isLoading: accountLoading } = useGetUserInfo();
  const { data: homeUsers, isLoading: usersLoading } = useGetHomeUsers(
    !!account
  );
  const userId = useAuthState((state) => state.userId);

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

      <Skeleton visible={accountLoading} animate={true} radius="sm">
        <Group spacing="sm">
          <Avatar size={40} src={account?.thumb} radius={40} />
          <div>
            <Text size="sm" weight={500}>
              {account?.username}
            </Text>
            <Text color="dimmed" size="xs">
              {account?.email}
            </Text>
          </div>
        </Group>
      </Skeleton>

      {account && (
        <Select
          label="Select Profile"
          itemComponent={SelectItem}
          value={userId?.toString()}
          onChange={(value) => setUserId(Number(value))}
          mt="xl"
          disabled={usersLoading}
          filter={(value, item) =>
            item.label?.toLowerCase().includes(value.toLowerCase().trim()) ??
            false
          }
          data={
            homeUsers?.users.map(
              (user) =>
                ({
                  value: user.id.toString(),
                  label: user.username ?? user.title,
                  thumb: user.thumb,
                  user,
                } as SelectItem)
            ) ?? []
          }
        />
      )}

      <Button mt="md" variant="outline" onClick={() => done()}>
        Next
      </Button>
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
