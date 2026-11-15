import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class JobBase(BaseModel):
    title: str
    organization: str
    location: str
    employment_type: str
    description: str
    requirements: str
    accommodations: str
    application_url: str
    audio_summary: Optional[str] = None


class JobResponse(JobBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
