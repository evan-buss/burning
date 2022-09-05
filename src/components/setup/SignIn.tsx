import { Button, Card, Center, Text, Title } from "@mantine/core";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { IPlexClientDetails, PlexOauth } from "plex-oauth";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { setAccessToken, useAuthState } from "../../state/auth.store";
import { useCardStyles } from "./setup-utils";

interface SignInStepProps {
  done: () => void;
}

const usePlexAuth = (done: () => void) => {
  const { query, replace } = useRouter();
  const [authUrl, setAuthUrl] = useState<string | undefined>(undefined);
  const [pin, setPin, removePin] = useLocalStorage<number>("pin", 123);

  const clientId = useAuthState((state) => state.clientId);
  const token = useAuthState((state) => state.accessToken);

  const clientInfo: IPlexClientDetails = {
    clientIdentifier: clientId, // This is a unique identifier used to identify your app with Plex.
    product: "Burning for Plex", // Name of your application
    device: "Burning for Plex", // The type of device your application is running on
    version: "1", // Version of your application
    forwardUrl: `http://localhost:3000/setup/?postback=true`, // Optional - Url to forward back to after signing in.
    platform: "Web", // Optional - Platform your application runs on - Defaults to 'Web'
    urlencode: true, // Optional - If set to true, the output URL is url encoded, otherwise if not specified or 'false', the output URL will return as-is
  };

  const [oauth] = useState(new PlexOauth(clientInfo));
  useEffect(() => {
    const authenticate = async () => {
      console.log("query", query);

      if (!!token) {
        done();
        return;
      }

      if (query["postback"]) {
        console.log("postback branch");
        try {
          const authToken = await oauth.checkForAuthToken(pin as number);
          console.log("authToken", authToken);
          if (authToken) {
            console.log("before", token);
            setAccessToken(authToken);
            console.log("after", token);
            setCookie("plex-token", authToken, { sameSite: "strict" });
            removePin();
            done();
          }
        } catch (error) {
          console.error(error);
        } finally {
          console.log("replacing");
          replace("/setup", undefined, { shallow: true });
        }

        return;
      }

      console.log("getting pin");
      const [link, pinId] = await oauth.requestHostedLoginURL();
      setAuthUrl(link);
      setPin(pinId);
    };

    authenticate();
  }, [query]);

  return { url: authUrl };
};

export default function SignInStep({ done }: SignInStepProps) {
  const { classes } = useCardStyles();
  const { url } = usePlexAuth(done);

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Title order={2} mb="md">
        Sign In To Your Plex Account
      </Title>
      <Text size="md" color="dimmed" mt={3} mb="xl">
        Burning will redirect you to Plex.tv to sign in. Once authenticated, you
        will be redirected back. Burning never sees your Plex username or
        password.
      </Text>

      <Center>
        <Button
          component="a"
          href={url ?? ""}
          disabled={!url}
          color="yellow"
          size="md"
        >
          Sign In With Plex
        </Button>
      </Center>
    </Card>
  );
}
