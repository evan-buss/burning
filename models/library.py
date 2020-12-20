from pydantic import BaseModel
from plexapi.library import LibrarySection


class Library(BaseModel):
    title: str
    # 'type' can be show, artist, movie
    type: str
    id: str

    @staticmethod
    def parse(section: LibrarySection) -> "Library":
        return Library(title=section.title, type=section.type, id=section.uuid)
