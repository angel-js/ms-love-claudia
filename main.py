from fastapi import FastAPI
from app.routes.love_route import router as love_router
from app.routes.controller_message import router as message_router

app = FastAPI()

app.include_router(message_router)
app.include_router(love_router)