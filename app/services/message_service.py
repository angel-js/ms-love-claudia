from app.services.love_service import love_service

class MessageService:

    def __init__(self):
        self.messages = []

    def send_message(self, message):

        if message["include_counter"]:
            counter = love_service.get_counter()
            message["counter"] = counter

        self.messages.append(message)

        return {"status": "sent"}

    def get_messages(self, user):
        return [m for m in self.messages if m["receiver"] == user]

    def get_last_message(self, user):
        user_messages = [
            m for m in self.messages if m["receiver"] == user
        ]

        if not user_messages:
            return {"message": "no messages yet"}

        return user_messages[-1]


message_service = MessageService()