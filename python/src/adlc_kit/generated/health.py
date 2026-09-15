"""Generated from fixtures/schema/health.schema.json by scripts/generate-contracts.ts.

Do not edit: regenerate with ``pnpm run gen:contracts``.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class HealthStatus(BaseModel):
    """Payload of GET /health, served by the Node and Python faces."""

    model_config = {"extra": "forbid"}

    status: Literal["ok"]
    uptime_seconds: int = Field(ge=0)
