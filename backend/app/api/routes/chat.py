import logging

import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from google.api_core import exceptions as google_exceptions

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.models.user import User
from app.schemas.chat import ChatRequest

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])

_model = None
_configured_key: str | None = None


def _get_model():
    global _model, _configured_key
    settings = get_settings()
    api_key = (settings.gemini_api_key or "").strip()
    if not api_key:
        return None
    if _model is None or _configured_key != api_key:
        genai.configure(api_key=api_key)
        _model = genai.GenerativeModel(settings.gemini_model)
        _configured_key = api_key
    return _model


def _extract_reply(response) -> str:
    """Safely read Gemini text (blocked/safety responses may lack .text)."""
    try:
        text = response.text
        if text and text.strip():
            return text.strip()
    except (ValueError, AttributeError):
        pass

    candidates = getattr(response, "candidates", None) or []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        if content is None:
            continue
        for part in getattr(content, "parts", None) or []:
            part_text = getattr(part, "text", None)
            if part_text and str(part_text).strip():
                return str(part_text).strip()

    return ""


@router.post("/chat")
def chat(
    body: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate a supportive reply (requires authentication)."""
    _ = current_user

    model = _get_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured (missing GEMINI_API_KEY)",
        )

    prompt = f"""You are a supportive and empathetic mental wellness AI assistant.
You are not a licensed clinician. Encourage professional help for crises.
Keep responses concise, warm, and practical.

User message:
{body.message}
"""
    try:
        response = model.generate_content(prompt)
        reply = _extract_reply(response)
        if not reply:
            raise HTTPException(
                status_code=502,
                detail="AI returned an empty or blocked response. Please try again.",
            )
        return {"reply": reply}
    except HTTPException:
        raise
    except google_exceptions.GoogleAPIError as exc:
        logger.exception("Gemini API error")
        message = str(exc)
        if "429" in message or "quota" in message.lower():
            detail = (
                "AI quota exceeded. Enable billing or use a valid API key in Google AI Studio."
            )
        elif "404" in message and "not found" in message.lower():
            detail = (
                "AI model not found. Set GEMINI_MODEL to a model your key supports "
                "(e.g. gemini-2.0-flash). See Google AI Studio model list."
            )
        else:
            detail = f"AI service error: {message}"
        raise HTTPException(status_code=502, detail=detail) from exc
    except Exception as exc:
        logger.exception("Unexpected chat error")
        raise HTTPException(
            status_code=500,
            detail="Could not generate a response. Please try again.",
        ) from exc
