import os
import httpx

NTFY_BASE_URL = os.getenv("NTFY_BASE_URL", "https://ntfy.sh")


def send_push_notification(receiver: str, sender: str, message: str):
    topic = os.getenv(f"NTFY_TOPIC_{receiver.upper()}")
    if not topic:
        return

    try:
        httpx.post(
            f"{NTFY_BASE_URL}/{topic}",
            content=message,
            headers={
                "Title": f"Nuevo mensaje de {sender}",
                "Priority": "default",
                "Tags": "heart",
            },
            timeout=5,
        )
    except Exception:
        pass
