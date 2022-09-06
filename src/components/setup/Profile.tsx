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
import { forwardRef } from "react";
import { useGetHomeUsers, useGetUserInfo } from "../../lib/plex/plex.service";
import { useCardStyles } from "../../lib/styles";
import { setUserId, useAuthState } from "../../state/auth.store";

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
