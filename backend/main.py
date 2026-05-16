"""Backward-compatible entry: `uvicorn app.main:app` is preferred."""

from app.main import app

__all__ = ["app"]
