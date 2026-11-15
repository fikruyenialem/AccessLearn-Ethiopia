from decimal import Decimal
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class User(Base):
    """User account model for learners, instructors, and administrators."""

    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "role IN ('learner', 'instructor', 'admin')",
            name="chk_user_role",
        ),
    )

    # Primary key: UUID generated via Python's uuid.uuid4 default
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )

    # Full display name of the user
    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # Unique email address used for login
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    # Secure Argon2id password hash
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # User role: 'learner', 'instructor', or 'admin' (defaults to 'learner')
    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="learner",
    )

    # Timestamps with UTC timezone support and database server defaults
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
    # 1-to-1 relationship with AccessibilityPreference: deleted if user is deleted
    accessibility_preference: Mapped[Optional["AccessibilityPreference"]] = relationship(
        "AccessibilityPreference",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # 1-to-Many relationship with Course: NO cascade delete.
    # Prevents accidental deletion of courses when an instructor account is deleted.
    # passive_deletes="all" delegates enforcement directly to the database-level ondelete="RESTRICT" constraint.
    courses: Mapped[List["Course"]] = relationship(
        "Course",
        back_populates="instructor",
        passive_deletes="all",
    )

    # 1-to-Many relationship with Enrollment: deleted if user is deleted
    enrollments: Mapped[List["Enrollment"]] = relationship(
        "Enrollment",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class AccessibilityPreference(Base):
    """Individual accessibility preferences linked 1-to-1 with a User."""

    __tablename__ = "accessibility_preferences"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    preferred_language: Mapped[str] = mapped_column(
        String(10),
        default="en",
        nullable=False,
    )
    caption_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    caption_size: Mapped[str] = mapped_column(
        String(20),
        default="medium",
        nullable=False,
    )
    caption_color: Mapped[str] = mapped_column(
        String(30),
        default="white_on_black",
        nullable=False,
    )
    contrast_mode: Mapped[str] = mapped_column(
        String(20),
        default="normal",
        nullable=False,
    )
    text_scale: Mapped[Decimal] = mapped_column(
        Numeric(3, 2),
        default=Decimal("1.00"),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="accessibility_preference",
    )
