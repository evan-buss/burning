from typing import List, Optional

from fastapi import APIRouter, Depends
from plexapi.myplex import MyPlexUser, MyPlexAccount
from plexapi.server import PlexServer

from models.credentials import get_plex_account, get_plex_server

router = APIRouter()


class PlexAccountUser:
    id: int
    name: str
    thumbnail: str
    email: Optional[str] = None

    def __init__(self, user: MyPlexUser):
        self.name = user.title
        self.id = user.id
        self.email = user.email
        self.thumbnail = user.thumb


@router.get("/api/users")
def get_users(account: MyPlexAccount = Depends(get_plex_account)) -> List[PlexAccountUser]:
    return [PlexAccountUser(plex_user) for plex_user in account.users()]


@router.get("/api/libraries")
def get_libraries(plex: PlexServer = Depends(get_plex_server)) -> List[str]:
    return [section.title for section in plex.library.sections()]
