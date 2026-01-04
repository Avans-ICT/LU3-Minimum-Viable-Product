# ai-service/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # General
    app_name: str = Field(default="AI Recommender Service")
    app_env: str = Field(default="development")  # development | test | production

    # API
    api_prefix: str = Field(default="")  # e.g. "/api" if you want versioning later
    cors_origins: str = Field(default="*")  # comma-separated or "*" for dev

    # Security (internal service)
    ai_service_api_key: str = Field(default="")  # set in .env to enable X-API-Key check

    # ML
    model_artifact_path: str = Field(default="ai-service/ml/artifacts/current")
    model_version: str = Field(default="baseline")

    # Optional scoring defaults (used by integration endpoint)
    default_alpha: float = Field(default=0.5)
    default_beta: float = Field(default=0.5)
    algorithm_name: str = Field(default="content_based")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


def get_settings() -> Settings:
    return Settings()