import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db
from app.models.course import Course
from app.models.lesson import Lesson
from app.schemas.course import CourseDetailResponse, CourseResponse

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    """List all available courses across internal and integrated platforms."""
    return db.query(Course).order_by(Course.created_at.desc()).all()


@router.get("/{course_id}", response_model=CourseDetailResponse)
def get_course(course_id: uuid.UUID, db: Session = Depends(get_db)):
    """Retrieve detailed course information including all sequenced lessons and media assets."""
    course = (
        db.query(Course)
        .options(
            selectinload(Course.lessons).selectinload(Lesson.media_assets)
        )
        .filter(Course.id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID '{course_id}' was not found.",
        )
    return course
