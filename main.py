import time

from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from api import router
from data.dummy import DummyData, User

app = FastAPI()
users = DummyData()

app.include_router(router)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/users")
async def get_users():
    users.add_user(User(name="evan", age=23))
    return users.get_users()


@app.middleware("http")
async def log_middleware(request: Request, call_next):
    start_time = time.time()
    response: Response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["x-process-time"] = str(process_time)
    return response


app.mount("/", StaticFiles(directory="client/build/", html=True), name="client")
