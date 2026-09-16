"""The Fastify-equivalent application factory: builds without binding; the
entrypoint owns host, port, and listening. Tests drive the app through the
ASGI transport, never a live socket."""

from __future__ import annotations

import time
from collections.abc import Callable

from fastapi import FastAPI

from adlc_kit.contracts import HealthStatus

_STARTED_AT = time.monotonic()


def create_app(uptime: Callable[[], int] | None = None) -> FastAPI:
    """Build the FastAPI application without binding a port."""

    def default_uptime() -> int:
        return int(time.monotonic() - _STARTED_AT)

    uptime_seconds = uptime if uptime is not None else default_uptime
    app = FastAPI()

    @app.get("/health", response_model=HealthStatus)
    def health() -> HealthStatus:
        return HealthStatus(status="ok", uptime_seconds=uptime_seconds())

    return app


#: Module-level ASGI instance for uvicorn's ``module:variable`` form; the
#: factory stays the test and composition entry.
app = create_app()
