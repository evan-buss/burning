import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Center,
  Group,
  Text,
  Title,
  Tooltip,
  Transition,
} from "@mantine/core";
import { useRouter } from "next/router";
import { ArrowCounterClockwise } from "phosphor-react";
import { IPlexClientDetails, PlexOauth } from "plex-oauth";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { StepProps } from ".";
import { useGetUserInfo } from "../../lib/plex/hooks";
import { setAccessToken, useBurningStore } from "../../state/store";

const usePlexAuth = () => {
  const { query, replace } = useRouter();
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [pin, setPin, removePin] = useLocalStorage<number>("pin", 123);

  const clientId = useBurningStore((state) => state.clientId);
  const accessToken = useBurningStore((state) => state.accessToken);

  const clientInfo: IPlexClientDetails = {
    clientIdentifier: clientId, // This is a unique identifier used to identify your app with Plex.
    product: "Burning for Plex", // Name of your application
    device: "Burning for Plex", // The type of device your application is running on
    version: "1", // Version of your application
    forwardUrl: `${process.env.NEXT_PUBLIC_URL}/setup?postback=true`, // Optional - Url to forward back to after signing in.
    platform: "Web", // Optional - Platform your application runs on - Defaults to 'Web'
    urlencode: true, // Optional - If set to true, the output URL is url encoded, otherwise if not specified or 'false', the output URL will return as-is
  };

  const [oauth] = useState(new PlexOauth(clientInfo));
  useEffect(() => {
    const authenticate = async () => {
      if (query["postback"]) {
        console.log("postback branch");
        try {
          const newAccessToken = await oauth.checkForAuthToken(pin as number);
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            removePin();
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
      setUrl(link);
      setPin(pinId);
    };

    authenticate();
  }, [query]);

  return { url, token: accessToken };
};

export default function SignInStep({ done }: StepProps) {
  const { url, token } = usePlexAuth();

  const { data: account } = useGetUserInfo(!!token);
  console.log("account", account);

  return (
    <Card withBorder radius="md" p="xl" className="mx-0 overflow-auto sm:m-xl">
      <Title order={2} mb="md">
        Sign In To Your Plex Account
      </Title>
      <Text size="md" color="dimmed" mt={3} mb="xl">
        Burning will redirect you to Plex.tv to sign in. Once authenticated, you
        will be redirected back. Burning never sees your Plex username or
        password.
      </Text>
      <Center>
        <Transition transition="fade" duration={1000} mounted={!!account}>
          {(style) => (
            <Group style={style} spacing="sm">
              <Avatar size={40} src={account?.thumb} radius={40} />
              <div>
                <Text size="sm" weight={500}>
                  {account?.username}
                </Text>
                <Text color="dimmed" size="xs">
                  {account?.email}
                </Text>
              </div>
              <Tooltip label="Sign In Again">
                <ActionIcon color="yellow" size="lg" component="a" href={url}>
                  <ArrowCounterClockwise size={24} />
                </ActionIcon>
              </Tooltip>
            </Group>
          )}
        </Transition>

        {!account && (
          <Button
            component="a"
            href={url}
            disabled={!url}
            color="yellow"
            size="md"
          >
            Sign In With Plex
          </Button>
        )}
      </Center>

      {account && (
        <Button mt="md" variant="outline" onClick={() => done()}>
          Next
        </Button>
      )}
    </Card>
  );
}
