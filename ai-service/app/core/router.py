# ai-service/app/api/router.py
from fastapi import APIRouter

from app.api.routers import recommendations
from app.api.routers import integration_recommendations

router = APIRouter()

# Existing endpoint(s): POST /recommendations/recommend
router.include_router(
    recommendations.router,
    prefix="/recommendations",
    tags=["recommendations"],
)

# Backend integration endpoint: POST /recommendations
router.include_router(
    integration_recommendations.router,
    prefix="/recommendations",
    tags=["integration"],
)