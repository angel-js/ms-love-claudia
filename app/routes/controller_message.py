from fastapi import APIRouter
from app.schemas.message_schema import MessageRequest
from app.services.message_service import message_service

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/")
def send_message(message: MessageRequest):
    return message_service.send_message(message.dict())


@router.get("/{user}")
def get_messages(user: str):
    return message_service.get_messages(user)

@router.get("/{user}/latest")
def get_latest_message(user: str):
    return message_service.get_last_message(user)