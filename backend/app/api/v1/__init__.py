from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.courses import router as courses_router
from app.api.v1.lessons import router as lessons_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.certificates import router as certificates_router
from app.api.v1.preferences import router as preferences_router
from app.api.v1.savanna import router as savanna_router

api_router = APIRouter()
api_router.include_router(health_router, prefix="", tags=["Health"])
api_router.include_router(auth_router)
api_router.include_router(courses_router)
api_router.include_router(lessons_router)
api_router.include_router(jobs_router)
api_router.include_router(certificates_router)
api_router.include_router(preferences_router)
api_router.include_router(savanna_router)

__all__ = ["api_router"]

