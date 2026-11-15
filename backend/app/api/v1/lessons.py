from decimal import Decimal
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user_optional, get_db
from app.models.lesson import Lesson
from app.models.enrollment import LearningProgress
from app.models.user import User
from app.schemas.course import LessonDetailResponse

router = APIRouter(prefix="/lessons", tags=["Lessons"])


class ProgressUpdatePayload(BaseModel):
    completion_percentage: Decimal
    last_position: Decimal
    status: Optional[str] = None


@router.get("/{lesson_id}", response_model=LessonDetailResponse)
def get_lesson(lesson_id: uuid.UUID, db: Session = Depends(get_db)):
    """Retrieve full lesson metadata, accessible HTML content, and associated media assets."""
    lesson = (
        db.query(Lesson)
        .options(selectinload(Lesson.media_assets))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson with ID '{lesson_id}' was not found.",
        )
    return lesson


@router.get("/{lesson_id}/offline-pack")
def get_offline_pack(lesson_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Generate an offline learning pack manifest for 2G/3G connectivity.
    Bundles lightweight accessible HTML, transcript cues, and metadata for client-side storage.
    """
    lesson = (
        db.query(Lesson)
        .options(selectinload(Lesson.media_assets))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson with ID '{lesson_id}' was not found.",
        )

    # Compile media inventory for offline storage
    media_inventory = [
        {
            "id": str(m.id),
            "media_type": m.media_type,
            "language": m.language,
            "format": m.format,
            "file_size": m.file_size,
            "url": m.storage_reference,
        }
        for m in lesson.media_assets
    ]

    return {
        "lesson_id": str(lesson.id),
        "course_id": str(lesson.course_id),
        "title": lesson.title,
        "description": lesson.description,
        "content_html": lesson.content_html,
        "sequence_number": lesson.sequence_number,
        "estimated_duration_minutes": lesson.estimated_duration,
        "media_assets": media_inventory,
        "offline_pack_version": "1.0",
        "generated_at": lesson.updated_at.isoformat(),
    }


@router.post("/{lesson_id}/progress")
def update_lesson_progress(
    lesson_id: uuid.UUID,
    payload: ProgressUpdatePayload,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Save or synchronize lesson completion progress for the current learner."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson with ID '{lesson_id}' was not found.",
        )

    if not current_user:
        # In low-connectivity or guest mode, accept progress and return confirmation
        return {
            "status": "recorded_locally",
            "lesson_id": str(lesson_id),
            "completion_percentage": float(payload.completion_percentage),
            "last_position": float(payload.last_position),
        }

    progress = (
        db.query(LearningProgress)
        .filter(
            LearningProgress.user_id == current_user.id,
            LearningProgress.lesson_id == lesson_id,
        )
        .first()
    )

    calc_status = payload.status
    if not calc_status:
        calc_status = "completed" if payload.completion_percentage >= Decimal("90.00") else "in_progress"

    if progress:
        progress.completion_percentage = payload.completion_percentage
        progress.last_position = payload.last_position
        progress.status = calc_status
    else:
        progress = LearningProgress(
            id=uuid.uuid4(),
            user_id=current_user.id,
            lesson_id=lesson_id,
            completion_percentage=payload.completion_percentage,
            last_position=payload.last_position,
            status=calc_status,
        )
        db.add(progress)

    db.commit()
    return {
        "status": "synchronized",
        "lesson_id": str(lesson_id),
        "user_id": str(current_user.id),
        "completion_percentage": float(progress.completion_percentage),
        "last_position": float(progress.last_position),
        "progress_status": progress.status,
    }
