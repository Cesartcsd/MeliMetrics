from functools import lru_cache
from typing import Literal

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: Literal["local", "test", "production"] = "local"
    log_level: str = "INFO"
    database_url: str | None = None
    internal_hmac_key: SecretStr | None = None

    model_config = SettingsConfigDict(
        env_prefix="MELIMETRICS_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    def require_internal_database(self) -> tuple[str, SecretStr]:
        if not self.database_url or not self.internal_hmac_key:
            raise ValueError(
                "MELIMETRICS_DATABASE_URL e MELIMETRICS_INTERNAL_HMAC_KEY são obrigatórias."
            )
        return self.database_url, self.internal_hmac_key


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
