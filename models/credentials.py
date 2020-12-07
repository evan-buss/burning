from typing import Optional

import requests
from fastapi import Header, HTTPException, Depends
from plexapi.exceptions import Unauthorized
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer


class Credentials:
    plex_token: str
    client_id: str
    server_ip: Optional[str] = None

    def __init__(self, x_plex_token: str = Header(...), x_client_id=Header(...)):
        if x_plex_token is None:
            raise HTTPException(status_code=401, detail="X-Plex-Token header missing.")

        self.plex_token = x_plex_token
        self.client_id = x_client_id


def get_plex_account(creds: Credentials = Depends(Credentials), timeout: int = 10) -> MyPlexAccount:
    """ Access the user's plex account via the Plex API servers. This allows you to then get all "server" objects
        associated with the user account. This should only be used for this purpose as it is much slower than
        accessing the server directly via the public IP.
    """

    return MyPlexAccount(creds.plex_token, timeout=timeout)


def get_plex_server(creds: Credentials = Depends(Credentials), timeout: int = 4) -> PlexServer:
    """ Connect to a specific Plex server using a token and a public IP address. """

    try:
        if creds.server_ip is not None:
            return PlexServer(creds.server_ip, creds.plex_token, timeout=timeout)

        raise HTTPException(status_code=400, detail="Attempting to direct connect to Plex server without IP address.")
    except Unauthorized:
        raise HTTPException(status_code=401, detail="Invalid Plex token. Please sign in again.")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail=f"Plex server connection timeout. IP: {creds.server_ip}")
