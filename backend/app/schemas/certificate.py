import uuid
from datetime import datetime
from pydantic import BaseModel


class CertificateVerifyResponse(BaseModel):
    is_valid: bool
    verification_code: str
    recipient_name: str
    course_title: str
    issuer: str
    issued_at: datetime
    status: str
