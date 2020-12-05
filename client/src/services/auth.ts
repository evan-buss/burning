import qs from "qs";

/**
 * @see https://forums.plex.tv/t/authenticating-with-plex/609370
 */

export interface Credentials {
    clientId?: string;
    accessToken?: string;
}

export interface TokenResponse {
    id: number;
    code: string;
}

export async function getPin(clientId: string): Promise<TokenResponse> {
    const res = await fetch("https://plex.tv/api/v2/pins", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "strong": "true",
            "X-Plex-Product": "Burning for Plex",
            "X-Plex-Client-Identifier": clientId
        },
    })

    return await res.json() as TokenResponse;
}

// curl - X GET 'https://plex.tv/api/v2/pins/<pinID>' \
// -H 'accept: application/json' \
// -d 'code=<pinCode>' \
// -d 'X-Plex-Client-Identifier=<clientIdentifier>'
export async function getTokenFromPin(pinId: string, pinCode: string, clientId: string): Promise<Credentials> {
    const res = await fetch(`https://plex.tv/api/v2/pins/${pinId}`, {
        headers: {
            "accept": "application/json",
            "code": pinCode,
            "X-Plex-Client-Identifier": clientId
        }
    });

    const json = await res.json();
}

export async function isTokenValid(clientId: string, accessToken: string) {
    // curl -X GET https://plex.tv/api/v2/user \
    // -H 'accept: application/json' \
    // -d 'X-Plex-Product=My Cool Plex App' \
    // -d 'X-Plex-Client-Identifier=<clientIdentifier>' \
    // -d 'X-Plex-Token=<userToken>'

    const res = await fetch("https://plex.tv/api/v2/user", {
        headers: {
            "accept": "application/json",
            "strong": "true",
            "X-Plex-Product": "Burning for Plex",
            "X-Plex-Client-Identifier": clientId,
            "X-Plex-Token": accessToken
        },
    })

    if (res.status === 200) return true;
    if (res.status === 401) return false;
    console.log("Unexpected status code.");
    return false;
}

export function getAuthURL(pinCode: string, clientId: string): string {
    return 'https://app.plex.tv/auth#?' +
        qs.stringify({
            clientID: clientId,
            code: pinCode,
            forwardUrl: 'http://localhost:3000/?postback=true',
            context: {
                device: {
                    product: 'Burning for Plex',
                },
            },
        });
}
