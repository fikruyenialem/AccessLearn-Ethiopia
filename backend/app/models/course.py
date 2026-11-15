import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Course(Base):
    """Course entity representing accessible curriculum units."""

    __tablename__ = "courses"
    __table_args__ = (
        CheckConstraint(
            "level IN ('Beginner', 'Intermediate', 'Advanced')",
            name="chk_course_level",
        ),
        CheckConstraint(
            "source IN ('internal', 'savanna')",
            name="chk_course_source",
        ),
    )

    # Primary key: UUID
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )

    # Instructor foreign key with RESTRICT: prevents deleting instructors who have active courses
    instructor_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Course Metadata
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Beginner",
    )
    thumbnail: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="internal",
    )
    external_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
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
    # Many-to-1 relationship with User (Instructor)
    instructor: Mapped["User"] = relationship(
        "User",
        back_populates="courses",
    )

    # 1-to-Many relationship with Lesson: ordered by sequence_number, cascade delete if course is deleted
    lessons: Mapped[List["Lesson"]] = relationship(
        "Lesson",
        back_populates="course",
        cascade="all, delete-orphan",
        order_by="Lesson.sequence_number",
    )

    # 1-to-Many relationship with Enrollment: passive_deletes="all" allows database RESTRICT to govern
    enrollments: Mapped[List["Enrollment"]] = relationship(
        "Enrollment",
        back_populates="course",
        passive_deletes="all",
    )
