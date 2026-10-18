import pytest
from pydantic import SecretStr

from melimetrics_pipeline.config import Settings


def test_internal_configuration_requires_both_values() -> None:
    with pytest.raises(ValueError, match="DATABASE_URL"):
        Settings().require_internal_database()


def test_internal_configuration_returns_secret_without_exposing_it() -> None:
    settings = Settings(
        database_url="postgresql://synthetic",
        internal_hmac_key=SecretStr("synthetic-key"),
    )

    database_url, hmac_key = settings.require_internal_database()

    assert database_url == "postgresql://synthetic"
    assert hmac_key.get_secret_value() == "synthetic-key"
    assert "synthetic-key" not in repr(settings)
