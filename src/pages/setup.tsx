import { Container, createStyles, Stepper } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useRouter } from "next/router";
import { Key, User } from "phosphor-react";
import ProfileStep from "../components/setup/Account";
import CompletedStep from "../components/setup/Complete";
import SelectLibrariesStep from "../components/setup/Libraries";
import SignInStep from "../components/setup/SignIn";

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
  const [active, handlers] = useCounter(0, { min: 0, max: 3 });
  const { push } = useRouter();

  return (
    <Container size="lg">
      <Stepper
        active={active}
        onStepClick={handlers.set}
        breakpoint="sm"
        className={classes.stepper}
      >
        <Stepper.Step progressIcon={<Key weight="bold" />} label="Register">
          <SignInStep done={handlers.increment} />
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={active > 0}
          progressIcon={<User weight="bold" />}
          label="Pick Profile"
        >
          <ProfileStep done={handlers.increment} />
        </Stepper.Step>
        <Stepper.Step allowStepSelect={active > 1} label="Choose Libraries">
          <SelectLibrariesStep done={handlers.increment} />
        </Stepper.Step>
        <Stepper.Completed>
          <CompletedStep done={() => push("/dashboard")} />
        </Stepper.Completed>
      </Stepper>
    </Container>
  );
}
