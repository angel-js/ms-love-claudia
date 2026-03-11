from pydantic import BaseModel

class MessageRequest(BaseModel):
    sender: str
    receiver: str
    message: str
    include_counter: bool = False


class MessageResponse(BaseModel):
    sender: str
    receiver: str
    message: str