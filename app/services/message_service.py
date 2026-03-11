from app.services.love_service import love_service
from app.repository.db import get_connection


class MessageService:

    def send_message(self, message):

        if message["include_counter"]:
            counter = love_service.get_counter()
        else:
            counter = None

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO public.messages (sender, receiver, message, include_counter)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (
                        message["sender"],
                        message["receiver"],
                        message["message"],
                        message["include_counter"],
                    ),
                )

        response = message.copy()

        if counter:
            response["counter"] = counter

        return {"status": "sent", "data": response}

    def get_messages(self, user):

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT sender, receiver, message, include_counter, created_at
                    FROM public.messages
                    WHERE receiver = %s
                    ORDER BY created_at ASC
                    """,
                    (user,),
                )

                rows = cur.fetchall()

        messages = []

        for r in rows:
            msg = {
                "sender": r[0],
                "receiver": r[1],
                "message": r[2],
                "include_counter": r[3],
                "created_at": r[4],
            }

            if msg["include_counter"]:
                msg["counter"] = love_service.get_counter()

            messages.append(msg)

        return messages

    def get_last_message(self, user):

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT sender, receiver, message, include_counter, created_at
                    FROM public.messages
                    WHERE receiver = %s
                    ORDER BY created_at DESC
                    LIMIT 1
                    """,
                    (user,),
                )

                row = cur.fetchone()

        if not row:
            return {"message": "no messages yet"}

        message = {
            "sender": row[0],
            "receiver": row[1],
            "message": row[2],
            "include_counter": row[3],
            "created_at": row[4],
        }

        if message["include_counter"]:
            message["counter"] = love_service.get_counter()

        return message


message_service = MessageService()