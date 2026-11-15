import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import (
    DateTime,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class Job(Base):
    """Career opportunity entity with accessibility metadata and audio overview."""

    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    organization: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="Addis Ababa, Ethiopia",
    )
    employment_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Full-time",
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    requirements: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )
    accommodations: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="Screen reader friendly, flexible hours, sign language interpreter support available upon request",
    )
    application_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    audio_summary: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )
