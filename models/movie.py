from pprint import pprint
from types import ClassMethodDescriptorType
from typing import Optional
from pydantic import BaseModel
from plexapi.video import Video


class Movie(BaseModel):
    title: str
    guid: str
    rating: Optional[float]
    imdb: Optional[str]
    summary: str
    tagline: str
    poster: str
    year: int

    @staticmethod
    def parse(movie: Video):
        pprint(vars(movie))
        imdb = None
        imdb_key = "imdb://"
        if imdb_key in movie.guid:
            imdb = (
                "https://imdb.com/title/" + movie.guid[movie.guid.find(imdb_key) + len(imdb_key) :]
            )

        return Movie(
            title=movie.title,
            guid=movie.guid,
            rating=movie.rating,
            imdb=imdb,
            summary=movie.summary,
            tagline=movie.tagline,
            poster=movie.thumbUrl,
            year=movie.year,
        )
