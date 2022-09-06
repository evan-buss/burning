import { Container, createStyles, Stepper } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useRouter } from "next/router";
import { Key, User } from "phosphor-react";
import { useState } from "react";
import CompletedStep from "../components/setup/Complete";
import SelectLibrariesStep from "../components/setup/Libraries";
import ProfileStep from "../components/setup/Profile";
import SignInStep from "../components/setup/SignIn";
import { Directory } from "../lib/plex/plex.model";
import { useGetUserInfo } from "../lib/plex/plex.service";
import { useAuthState } from "../state/auth.store";
import { trpc } from "../utils/trpc";

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
  const { push } = useRouter();
  const [active, handlers] = useCounter(0, { min: 0, max: 3 });

  const accessToken = useAuthState((state) => state.accessToken);
  const [libraries, setLibraries] = useState<Directory[]>([]);

  const { data } = useGetUserInfo();
  const createUser = trpc.useMutation(["user.createOrUpdate"]);
  const saveProfile = async () => {
    await createUser.mutateAsync({
      email: data?.email,
      uuid: data?.uuid,
      username: data?.username,
      libraries: libraries.map((library) => ({
        ...library,
        address: library.connection,
      })),
    });
    push("/dashboard");
  };

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
          <SelectLibrariesStep
            done={handlers.increment}
            setLibraries={setLibraries}
          />
        </Stepper.Step>
        <Stepper.Completed>
          <CompletedStep done={saveProfile} />
        </Stepper.Completed>
      </Stepper>
    </Container>
  );
}
