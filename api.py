from fastapi import APIRouter, Depends

from models.user import User

router = APIRouter()

@router.get("/api/users")
async def get_users(user: User = Depends(User)):
    return "test"


@router.get("/api/libraries")
async def get_libraries(user: User = Depends(User)):
    print(user.plex_token)
    print(user.client_id)

    return [section.title for section in user.plex.library.sections()]

# @router.get("/api/test")
# def list_recents():
#     plex = PlexServer("http://192.168.1.222:32400", token=token)
#     return plex.account().users()
#     # return [acct.name for acct in plex.systemAccounts()]
#     # print(account)
#     # return [section.title for section in plex.library.sections()]
#     # return [movie.title for movie in plex.library.section("Movies Evan").search(unwatched=True)]
#     # movies = plex.library.section('Movies')
#     # return movies.search(unwatched=True)
#
#
# @router.get("/api/remote")
# def list_recents_remote():
#     account = MyPlexAccount(token=token, username=".Public")
#     plex = account.resource("Home Media").connect()
#     return len(plex.library.movies)
#
#     # return [user.email for user in plex.users()]
# return [(device.name, device.publicAddress) for device in account.devices()]
