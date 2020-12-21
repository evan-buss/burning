from models.movie import Movie
from pprint import pprint
from typing import List

from fastapi import APIRouter, Depends
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer

from models.credentials import Credentials, get_plex_account, get_plex_server
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


@router.get("/swipe", response_model=List[Movie])
def get_swipe(
    account: MyPlexAccount = Depends(get_plex_account),
    plex: PlexServer = Depends(get_plex_server),
    creds: Credentials = Depends(Credentials),
):

    section = plex.library.section("Movies Evan")
    # pprint(vars(section))

    # print(section.totalSize)
    
    return [Movie.parse(item) for item in section.fetchItems(
        "/library/sections/%s/all" % section.key,
        container_start=1,
        container_size=5,
    )]
    return "test"

    # playlist = plex.playlists()[0]
    # [pprint(vars(item)) for item in playlist.items()]

    # user_acct = account.user("Evan")
    # user_plex = PlexServer(creds.server_ip, user_acct.get_token(plex.machineIdentifier))
    # print("INSIDE USERS ACCOUNT")

    # playlist = user_plex.playlists()[0]
    # [pprint(vars(item)) for item in playlist.items()]
    # # userplex.playlist('Test Playlist').delete

    # # pprint(vars(plex.library.section("Movies Evan")))
