import requests
from fastapi import Header, HTTPException
from plexapi.exceptions import Unauthorized
from plexapi.server import PlexServer


class User:
    plex_token: str
    client_id: str
    plex: PlexServer

    def __init__(self, x_plex_token: str = Header(...), x_client_id=Header(...)):
        if x_plex_token is None:
            raise HTTPException(status_code=401, detail="X-Plex-Token header missing.")

        self.plex_token = x_plex_token
        self.client_id = x_client_id
        self.plex = self.connect_to_server()

    def connect_to_server(self, timeout: int = 4) -> PlexServer:
        try:
            return PlexServer("http://192.168.1.222:32300", self.plex_token, timeout=timeout)
        except Unauthorized:
            raise HTTPException(status_code=401, detail="Invalid plex token. Please sign in again.")
        except requests.exceptions.ConnectionError:
            raise HTTPException(status_code=503, detail="Plex server connection timeout.")
