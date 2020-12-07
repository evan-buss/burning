from typing import List, Optional, Any

from fastapi import APIRouter, Depends
from plexapi.myplex import MyPlexUser, MyPlexAccount
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
            name=user.title,
            id=user.id,
            email=user.email,
            thumbnail=user.thumb
        )


@router.get("/api/users", response_model=List[PlexAccountUser])
def get_users(account: MyPlexAccount = Depends(get_plex_account)) -> List[PlexAccountUser]:
    return [PlexAccountUser.parse(plex_user) for plex_user in account.users()]


@router.get("/api/libraries", response_model=List[str])
def get_libraries(plex: PlexServer = Depends(get_plex_server)) -> List[str]:
    return [section.title for section in plex.library.sections()]
