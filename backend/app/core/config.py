from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

# Locate the project root independently of the current working directory:
# backend/app/core/config.py -> parents[3] is AccessLearn-Ethiopia/
PROJECT_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE_PATH = PROJECT_ROOT / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "AccessLearn Ethiopia API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    # Security Configuration (SECRET_KEY is mandatory from env/.env, no hardcoded fallback)
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # Database connection URL (defaults to absolute path SQLite in project root)
    DATABASE_URL: str = f"sqlite:///{PROJECT_ROOT / 'accesslearn.db'}"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
