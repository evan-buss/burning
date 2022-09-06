import axios from "axios";
import qs from "qs";

interface PinResponse {
  id: string;
  code: string;
}

/**
 * @see https://forums.plex.tv/t/authenticating-with-plex/609370
 */

export const headers: Record<string, string> = {
  "X-Plex-Client-Identifier": "Burning for Plex",
  "X-Plex-Version": "3",
  "X-Plex-Device": "Burning for Plex",
  "X-Plex-Platform": "Web",
  "X-Plex-Product": "Burning for Plex",
  accept: "application/json",
};

/**
 * Generate a new pin id / code pair if one isn't present.
 * This is the first step to authenticating a user via OAuth.
 *
 * @param clientId The unique identifier for the user's device.
 */
export async function getPin(clientId: string): Promise<PinResponse> {
  const res = await axios.post("https://plex.tv/api/v2/pins", null, {
    headers: {
      strong: "true",
      "X-Plex-Client-Identifier": clientId,
      ...headers,
    },
  });

  return { id: res.data.id, code: res.data.code } as PinResponse;
}

// curl - X GET 'https://plex.tv/api/v2/pins/<pinID>' \
// -H 'accept: application/json' \
// -d 'code=<pinCode>' \
// -d 'X-Plex-Client-Identifier=<clientIdentifier>'

/**
 * Attempt to get the access token from the user's pin code after they have authenticated and been
 * forwarded back to our application.
 *
 * @param clientId The unique identifier for the user's device.
 * @param pinId The generated id that was used for the OAuth redirect sign-in page.
 * @param pinCode The generated pin code that was previously generated and stored.
 */
export async function getTokenFromPin(
  clientId: string,
  pinId: string,
  pinCode: string
): Promise<string> {
  const res = await axios.get(`https://plex.tv/api/v2/pins/${pinId}`, {
    headers: {
      code: pinCode,
      "X-Plex-Client-Identifier": clientId,
      ...headers,
    },
  });

  if (res.status === 200) {
    console.log(res.data);
    if (res.data.authToken === null) {
      return Promise.reject("AuthToken is null");
    }
    return res.data.authToken;
  }
  return Promise.reject("Error getting access token");
}

/**
 * Determine if the user's saved accessToken is still valid.
 *
 * @param clientId The unique identifier for the user's device.
 * @param accessToken A previously generated token we are checking is still valid.
 */
export async function isTokenValid(clientId: string, accessToken: string) {
  // curl -X GET https://plex.tv/api/v2/user \
  // -H 'accept: application/json' \
  // -d 'X-Plex-Product=My Cool Plex App' \
  // -d 'X-Plex-Client-Identifier=<clientIdentifier>' \
  // -d 'X-Plex-Token=<userToken>'

  const res = await axios.get("https://plex.tv/api/v2/user", {
    headers: {
      strong: "true",
      "X-Plex-Client-Identifier": clientId,
      "X-Plex-Token": accessToken,
      ...headers,
    },
  });

  if (res.status === 200) return true;
  if (res.status === 401) return false;
  console.log("Unexpected status code.");
  return false;
}

/**
 * Construct the auth URL endpoint. This endpoint shows the plex sign-in page.
 * Once the user signs in they will be redirected forwardUrl where you can proceed
 * to try getting the user's authToken
 *
 * @param clientId The unique identitifer for the user's device.
 * @param pinCode The generated pin code that is used to link this device to the plex account.
 */
export function getAuthURL(clientId: string, pinCode?: string): string | null {
  if (!pinCode) return null;
  return (
    "https://app.plex.tv/auth#?" +
    qs.stringify({
      clientID: clientId,
      code: pinCode,
      forwardUrl: `${location.href}?postback=true`,
      context: {
        device: {
          product: "Plex Web",
          platform: "Web",
          device: "Burning for Plex",
          environment: "bundled",
          layout: "desktop",
        },
      },
    })
  );
}
