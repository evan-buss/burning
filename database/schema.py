from sqlalchemy import Integer
from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import Boolean, String

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    thumbnail = Column(
        String,
    )


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    movieGuid = Column(String, index=True)
    isLiked  = Column(Boolean, default=False)
    libraryGuid = Column(String, index=True)


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    playlistUser = Column(String)
    playlistName = Column(String, default="Burning Matches")
