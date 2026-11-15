import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class MediaAssetResponse(BaseModel):
    id: uuid.UUID
    lesson_id: uuid.UUID
    media_type: str
    language: str
    storage_reference: str
    format: str
    file_size: int
    verified: bool

    model_config = ConfigDict(from_attributes=True)


class LessonBase(BaseModel):
    title: str
    description: str
    content_html: str
    sequence_number: int
    estimated_duration: int


class LessonResponse(LessonBase):
    id: uuid.UUID
    course_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LessonDetailResponse(LessonResponse):
    media_assets: List[MediaAssetResponse] = []


class CourseBase(BaseModel):
    title: str
    description: str
    level: str
    thumbnail: Optional[str] = None
    source: str = "internal"
    external_id: Optional[str] = None


class CourseResponse(CourseBase):
    id: uuid.UUID
    instructor_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CourseDetailResponse(CourseResponse):
    lessons: List[LessonDetailResponse] = []
