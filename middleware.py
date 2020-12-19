import time

from fastapi import Request, Response


async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    response: Response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["x-process-time"] = str(process_time)
    return response
