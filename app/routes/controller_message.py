from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.message_schema import MessageRequest
from app.services.message_service import message_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/")
def send_message(message: MessageRequest, current_user: str = Depends(get_current_user)):
    if message.sender != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot send as another user")
    return message_service.send_message(message.dict())


@router.get("/{user}")
def get_messages(user: str, current_user: str = Depends(get_current_user)):
    if user != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot read another user's messages")
    return message_service.get_messages(user)


@router.get("/{user}/latest")
def get_latest_message(user: str, current_user: str = Depends(get_current_user)):
    if user != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot read another user's messages")
    return message_service.get_last_message(user)
