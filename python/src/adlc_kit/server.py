"""Server entrypoint: the only place that reads HOST/PORT and listens."""

from __future__ import annotations

import os

import uvicorn

from adlc_kit.app import create_app


def main() -> None:
    port = int(os.environ.get("PORT", "8000"))
    host = os.environ.get("HOST", "127.0.0.1")
    uvicorn.run(create_app(), host=host, port=port)


if __name__ == "__main__":
    main()
