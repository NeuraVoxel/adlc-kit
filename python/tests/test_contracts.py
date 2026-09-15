"""Contract replay: both faces validate the same committed fixtures against
their generated artifacts — the offline half of the cross-stack seam."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from adlc_kit.contracts import HealthStatus

FIXTURES = Path(__file__).resolve().parent.parent.parent / "fixtures"


def test_accepts_the_passing_fixture() -> None:
    payload = json.loads((FIXTURES / "health.pass.json").read_text(encoding="utf-8"))
    parsed = HealthStatus.model_validate(payload)
    assert parsed.status == "ok"
    assert parsed.uptime_seconds == 42


def test_rejects_the_rejected_fixture() -> None:
    payload = json.loads((FIXTURES / "health.rejected.json").read_text(encoding="utf-8"))
    with pytest.raises(ValidationError):
        HealthStatus.model_validate(payload)


def test_rejects_an_unknown_property() -> None:
    with pytest.raises(ValidationError):
        HealthStatus.model_validate({"status": "ok", "uptime_seconds": 1, "extra": True})
