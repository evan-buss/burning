from typing import List

from dataclasses import dataclass


@dataclass
class User:
    name: str
    age: int


class DummyData:
    def __init__(self):
        self._data: List[User] = []

    def __len__(self) -> int:
        return len(self._data)

    def add_user(self, name: User) -> None:
        self._data.append(name)

    def get_users(self) -> List[User]:
        return self._data
