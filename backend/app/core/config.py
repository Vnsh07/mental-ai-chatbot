from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]

    @field_validator("secret_key")
    @classmethod
    def secret_min_length(cls, v: str) -> str:
        if len(v) < 16:
            raise ValueError("SECRET_KEY must be at least 16 characters (use 32+ in production)")
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
