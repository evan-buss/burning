from fastapi import APIRouter

router = APIRouter()


@router.get("/api/nested/route")
async def get_nested_route():
    return "Nested route here"
