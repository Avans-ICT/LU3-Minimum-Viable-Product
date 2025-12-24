from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # General
    app_name: str = Field(default="AI Recommender Service")
    app_env: str = Field(default="development")  # development | test | production

    # API
    api_prefix: str = Field(default="")  # e.g. "/api" if you want versioning later
    cors_origins: str = Field(default="*")  # comma-separated or "*" for dev

    # ML
    model_artifact_path: str = Field(default="ai-service/ml/artifacts/current")
    model_version: str = Field(default="baseline")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


def get_settings() -> Settings:
    # simple singleton-ish cache (FastAPI will reuse module)
    return Settings()