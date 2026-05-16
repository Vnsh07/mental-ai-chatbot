from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, chat, users
from app.core.config import get_settings
from app.core.database import Base, engine
from app.models import user as user_model  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


def create_application() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title="Mental AI API",
        version="1.0.0",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(auth.router, prefix="/api/v1")
    application.include_router(users.router, prefix="/api/v1")
    application.include_router(chat.router, prefix="/api/v1")

    @application.get("/")
    def health():
        return {"message": "Mental AI Backend Running", "version": "1.0.0"}

    return application


app = create_application()
