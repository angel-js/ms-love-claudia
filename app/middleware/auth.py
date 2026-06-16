import os
from fastapi import Header, HTTPException, status

API_KEYS: dict[str, str] = {}


def _load_keys():
    for key, value in os.environ.items():
        if key.startswith("API_KEY_"):
            user = key.removeprefix("API_KEY_").lower()
            API_KEYS[value] = user


_load_keys()


def get_current_user(x_api_key: str = Header(...)) -> str:
    user = API_KEYS.get(x_api_key)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
    return user
