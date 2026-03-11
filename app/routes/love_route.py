from fastapi import APIRouter
from app.services.love_service import love_service

router = APIRouter(
    prefix="/love",
    tags=["love"]
)

@router.get("/counter")
def love_counter():
    return love_service.get_counter()

