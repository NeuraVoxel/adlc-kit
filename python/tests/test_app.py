"""GET /health describes behavior: ok status with numeric uptime, served
through the ASGI transport — no live socket."""

from __future__ import annotations

from fastapi.testclient import TestClient

from adlc_kit.app import create_app


def test_health_reports_ok_with_numeric_uptime() -> None:
    client = TestClient(create_app(uptime=lambda: 42))
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert isinstance(body["uptime_seconds"], int)
