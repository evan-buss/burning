import {
  Button,
  Card,
  Center,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Medal } from "phosphor-react";

interface CompletedStepProps {
  done: () => void;
}

export default function CompletedStep({ done }: CompletedStepProps) {
  const theme = useMantineTheme();

  return (
    <Card withBorder radius="md" p="xl" className="mx-0 overflow-auto sm:m-xl">
      <Title order={2} mb="md" align="center">
        <Medal
          color={theme.fn.primaryColor()}
          size={30}
          style={{
            position: "relative",
            top: 5,
            marginRight: theme.spacing.sm,
          }}
        />
        Setup Complete
      </Title>
      <Text size="md" color="dimmed" align="center" mt={3} mb="xl">
        Your settings have been saved and can be modified from the settings menu
        in the future.
      </Text>

      <Center>
        <Button
          onClick={done}
          variant="gradient"
          size="lg"
          gradient={{ from: "yellow.8", to: "yellow.5" }}
          mt="md"
        >
          Start Swiping
        </Button>
      </Center>
    </Card>
  );
}
