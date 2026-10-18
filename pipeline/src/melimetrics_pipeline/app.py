from fastapi import FastAPI

from . import __version__
from .config import get_settings

app = FastAPI(title="MeliMetrics Pipeline", version=__version__)


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    settings = get_settings()
    return {"status": "ok", "environment": settings.environment}
