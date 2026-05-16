import os

import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.chat import ChatRequest

router = APIRouter(tags=["chat"])

_api_key = os.getenv("GEMINI_API_KEY")
_model = None

if _api_key:
    genai.configure(api_key=_api_key)
    _model = genai.GenerativeModel("gemini-1.5-pro")
@router.post("/chat")
def chat(
    body: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate a supportive reply (requires authentication)."""
    if _model is None:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured (missing GEMINI_API_KEY)",
        )

    user_message = body.message

    _ = current_user  # tie chat to authenticated user for audit / rate limits

    prompt = f"""
You are a supportive and empathetic mental wellness AI assistant.

User message:
{user_message}
"""
    response = _model.generate_content(prompt)
    reply = response.text or ""
    return {"reply": reply}
