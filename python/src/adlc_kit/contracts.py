"""Cross-surface wire types shared by the Node and Python faces.

Everything exported here is generated from ``fixtures/schema/*.schema.json``
— the single source of truth. Hand-written wire types anywhere in the
repository are forbidden; regenerate with ``pnpm run gen:contracts`` and
update provider and consumer in the same change.
"""

from adlc_kit.generated.health import HealthStatus

__all__ = ["HealthStatus"]
