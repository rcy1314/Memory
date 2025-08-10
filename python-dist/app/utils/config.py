import os
import typing

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    VERSION: str = "0.1.0"
    APP_TITLE: str = "Time Studio"
    PROJECT_NAME: str = "Time Studio"
    APP_DESCRIPTION: str = "Description"

    CORS_ORIGINS: typing.List = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: typing.List = ["*"]
    CORS_ALLOW_HEADERS: typing.List = ["*"]

    PROJECT_ROOT: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), os.pardir)
    )
    BASE_DIR: str = os.path.abspath(os.path.join(PROJECT_ROOT, os.pardir))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    SECRET_KEY: str = "3488a63e1765035d386f05409663f55c83bfae3b3c61a932744b20ad14244dcf"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    DB_CONNECTION: dict = {
        "db_url": f"sqlite:///{DATA_DIR}/db.sqlite3?timeout=30&journal_mode=WAL&synchronous=NORMAL&cache_size=10000&temp_store=memory",
        "modules": {"models": ["app.models"]},
        "use_tz": False,
        "timezone": "Asia/Shanghai",
    }
    TORTOISE_ORM: dict = {
        "connections": {
            "default": {
                "engine": "tortoise.backends.sqlite",
                "credentials": {
                    "file_path": f"{DATA_DIR}/db.sqlite3",
                    "journal_mode": "WAL",
                    "synchronous": "NORMAL",
                    "cache_size": 10000,
                    "temp_store": "memory",
                    "timeout": 30,
                    "check_same_thread": False,
                }
            }
        },
        "apps": {
            "models": {
                "models": ["app.models"],
                "default_connection": "default",
            },
        },
        "use_tz": False,
        "timezone": "Asia/Shanghai",
    }
    DATETIME_FORMAT: str = "%Y-%m-%d %H:%M:%S"


settings = Settings()
