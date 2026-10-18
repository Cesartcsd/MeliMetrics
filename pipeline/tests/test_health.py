from fastapi.testclient import TestClient

from melimetrics_pipeline.app import app


def test_health_is_synthetic_and_does_not_require_external_credentials() -> None:
    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
