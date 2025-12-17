# router.py
from fastapi import APIRouter
from app.endpoints import recommendations

router = APIRouter()
router.include_router(
    recommendations.router,
    prefix="/recommendations",
    tags=["recommendations"]
)