from typing import List, Optional, Any
from pprint import pprint
from dataclasses import dataclass

from fastapi import APIRouter, Depends
from plexapi.myplex import MyPlexDevice, MyPlexUser, MyPlexAccount
from plexapi.server import PlexServer
from pydantic.main import BaseModel

from models.credentials import get_plex_account, get_plex_server

router = APIRouter()


class PlexAccountUser(BaseModel):
    id: int
    name: str
    thumbnail: str
    email: Optional[str] = None

    @staticmethod
    def parse(user: MyPlexUser):
        return PlexAccountUser(
            name=user.title, id=user.id, email=user.email, thumbnail=user.thumb
        )


@dataclass
class Server:
    name: str
    ip: str
    id: str
    device: str

    def __init__(self, device: MyPlexDevice):
        self.name = device.name
        self.id = device.id
        self.device = device.device
        self.ip = next(ip for ip in device.connections if device.publicAddress in ip)


@router.get("/users", response_model=List[PlexAccountUser])
def get_users(
    account: MyPlexAccount = Depends(get_plex_account),
) -> List[PlexAccountUser]:
    return [PlexAccountUser.parse(plex_user) for plex_user in account.users()]


@router.get("/servers")
def get_servers(account: MyPlexAccount = Depends(get_plex_account)):
    servers = [
        Server(device) for device in account.devices() if "server" in device.provides
    ]
    pprint(servers)
    return servers


@router.get("/libraries")
def get_libraries(plex: PlexServer = Depends(get_plex_server)) -> List[Any]:
    [pprint(vars(section)) for section in plex.library.sections()]
    # 'type' can be show, artist, movie
    return [
        {"title": section.title, "type": section.type, "id": section.uuid}
        for section in plex.library.sections()
    ]
