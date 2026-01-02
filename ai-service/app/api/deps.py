from __future__ import annotations

from fastapi import Header, HTTPException
from app.core.config import get_settings


def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    settings = get_settings()
    expected = getattr(settings, "ai_service_api_key", None)

    # If no key is configured, do not block (dev-friendly).
    if not expected:
        return

    if x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")
