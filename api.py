from pprint import pprint
from typing import List

from fastapi import APIRouter, Depends
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer

from models.credentials import get_plex_account, get_plex_server
from models.plex_account_user import PlexAccountUser
from models.server import Server
from models.library import Library

router = APIRouter()


@router.get("/users", response_model=List[PlexAccountUser])
def get_users(
    account: MyPlexAccount = Depends(get_plex_account),
) -> List[PlexAccountUser]:
    return [PlexAccountUser.parse(plex_user) for plex_user in account.users()]


@router.get("/servers", response_model=List[Server])
def get_servers(account: MyPlexAccount = Depends(get_plex_account)) -> List[Server]:
    servers = [
        Server.parse(device)
        for device in account.devices()
        if "server" in device.provides
    ]
    pprint(servers)
    return servers


@router.get("/libraries", response_model=List[Library])
def get_libraries(plex: PlexServer = Depends(get_plex_server)) -> List[Library]:
    return [Library.parse(section) for section in plex.library.sections()]
