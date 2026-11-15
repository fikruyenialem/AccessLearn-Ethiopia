from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db
from app.models.certificate import Certificate
from app.schemas.certificate import CertificateVerifyResponse

router = APIRouter(prefix="/certificates", tags=["Certificates"])


@router.get("/verify/{verification_code}", response_model=CertificateVerifyResponse)
def verify_certificate(verification_code: str, db: Session = Depends(get_db)):
    """
    Publicly verify a course completion certificate by its unique code.
    Protects private user details while validating credentials.
    """
    cleaned_code = verification_code.strip()
    cert = (
        db.query(Certificate)
        .options(
            selectinload(Certificate.user),
            selectinload(Certificate.course),
        )
        .filter(Certificate.verification_code == cleaned_code)
        .first()
    )

    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate code '{verification_code}' could not be verified in the platform registry.",
        )

    return CertificateVerifyResponse(
        is_valid=(cert.status == "valid"),
        verification_code=cert.verification_code,
        recipient_name=cert.user.full_name,
        course_title=cert.course.title,
        issuer="AccessLearn Ethiopia / Digital Bridge Academy",
        issued_at=cert.issued_at,
        status=cert.status,
    )
