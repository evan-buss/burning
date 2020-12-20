from typing import Optional

from pydantic import BaseModel
from plexapi.myplex import MyPlexUser


class PlexAccountUser(BaseModel):
    id: int
    name: str
    thumbnail: str
    email: Optional[str] = None

    @staticmethod
    def parse(user: MyPlexUser) -> "PlexAccountUser":
        return PlexAccountUser(
            name=user.title, id=user.id, email=user.email, thumbnail=user.thumb
        )
