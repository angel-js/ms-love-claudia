from fastapi import APIRouter
import os
from app.services.love_service import love_service

router = APIRouter(
    prefix="/love",
    tags=["love"]
)

@router.get("/counter")
def love_counter():
    print(os.getenv("DATABASE_URL"))
    return love_service.get_counter()

