from plexapi.myplex import MyPlexDevice
from pydantic import BaseModel


class Server(BaseModel):
    name: str
    ip: str
    id: str
    device: str

    @staticmethod
    def parse(device: MyPlexDevice):
        return Server(
            name=device.name,
            id=device.id,
            device=device.device,
            ip=next(ip for ip in device.connections if device.publicAddress in ip),
        )
