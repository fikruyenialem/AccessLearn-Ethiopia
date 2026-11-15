import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Lesson(Base):
    """Lesson entity containing instructional media and accessible content."""

    __tablename__ = "lessons"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    course_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )
    content_html: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )
    sequence_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    estimated_duration: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=10,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="lessons",
    )
    media_assets: Mapped[List["MediaAsset"]] = relationship(
        "MediaAsset",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )
    progress_records: Mapped[List["LearningProgress"]] = relationship(
        "LearningProgress",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )


class MediaAsset(Base):
    """Media asset metadata for video, audio, captions, transcripts, and sign language."""

    __tablename__ = "media_assets"
    __table_args__ = (
        CheckConstraint(
            "media_type IN ('video', 'audio', 'caption', 'transcript', 'sign_language', 'audio_description', 'document')",
            name="chk_media_type",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    lesson_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    media_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    language: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="en",
    )
    storage_reference: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    format: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="mp4",
    )
    file_size: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )
    verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    # Relationships
    lesson: Mapped["Lesson"] = relationship(
        "Lesson",
        back_populates="media_assets",
    )
