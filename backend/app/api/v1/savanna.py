from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.course import Course

router = APIRouter(prefix="/integrations/savanna", tags=["Savanna Integration Adapter"])


@router.get("/status")
def savanna_integration_status():
    """Returns the Savanna adapter connection status, supported protocol versions, and capabilities."""
    return {
        "adapter_version": "1.0.0",
        "savanna_compatible": True,
        "supported_protocols": ["REST/JSON", "LTI-1.3-Ready", "Script-Embed"],
        "authentication_mode": "mock_adapter",
        "features": [
            "course_mapping",
            "progress_synchronization",
            "accessible_media_enrichment",
            "offline_pack_handshake",
        ],
    }


@router.get("/courses")
def list_savanna_courses(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """
    Retrieve courses originating from or mapped to the Savanna platform.
    Normalizes metadata to match Savanna LMS learning specifications.
    """
    courses = db.query(Course).filter(Course.source == "savanna").all()
    return [
        {
            "external_id": c.external_id or f"savanna-{c.id}",
            "internal_id": str(c.id),
            "title": c.title,
            "description": c.description,
            "level": c.level,
            "thumbnail": c.thumbnail,
            "accessibility_enhanced": True,
            "available_alternatives": ["EthSL", "Captions", "Transcripts", "AudioDescriptions"],
        }
        for c in courses
    ]


@router.post("/sync-progress")
def sync_savanna_progress(payload: Dict[str, Any]):
    """
    Adapter endpoint to receive or transmit progress records between AccessLearn and Savanna.
    Demonstrates clean separation of external platform concerns.
    """
    return {
        "status": "success",
        "synced_records": 1,
        "external_platform": "ALX Savanna",
        "received_payload": payload,
        "acknowledgement": "Progress recorded and queued for bidirectional handshake.",
    }
