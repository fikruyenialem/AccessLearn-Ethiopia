from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.job import Job
from app.schemas.job import JobResponse

router = APIRouter(prefix="/jobs", tags=["Career Gateway"])


@router.get("", response_model=List[JobResponse])
def list_jobs(db: Session = Depends(get_db)):
    """List accessible employment opportunities with accommodation tags and audio summaries."""
    return db.query(Job).order_by(Job.created_at.desc()).all()
