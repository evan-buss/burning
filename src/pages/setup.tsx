import { Container, createStyles, Stepper } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useRouter } from "next/router";
import { Key, User } from "phosphor-react";
import CompletedStep from "../components/setup/Complete";
import SelectLibrariesStep from "../components/setup/Libraries";
import ProfileStep from "../components/setup/Profile";
import SignInStep from "../components/setup/SignIn";
import { useAuthState } from "../state/auth.store";

const useStyles = createStyles((theme) => ({
  stepper: {
    padding: theme.spacing.xl * 2,
    [theme.fn.smallerThan("sm")]: {
      padding: 0,
    },
  },
}));

export default function Setup() {
  const { classes } = useStyles();
  const { replace } = useRouter();
  const [active, handlers] = useCounter(0, { min: 0, max: 3 });

  const accessToken = useAuthState((state) => state.accessToken);

  return (
    <Container size="lg">
      <Stepper
        active={active}
        onStepClick={handlers.set}
        breakpoint="sm"
        className={classes.stepper}
      >
        <Stepper.Step progressIcon={<Key weight="bold" />} label="Sign In">
          <SignInStep done={handlers.increment} />
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={!!accessToken}
          progressIcon={<User weight="bold" />}
          label="Pick Profile"
        >
          <ProfileStep done={handlers.increment} />
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={active > 1 && !!accessToken}
          label="Choose Libraries"
        >
          <SelectLibrariesStep done={handlers.increment} />
        </Stepper.Step>
        <Stepper.Completed>
          <CompletedStep done={() => replace("/dashboard")} />
        </Stepper.Completed>
      </Stepper>
    </Container>
  );
}
