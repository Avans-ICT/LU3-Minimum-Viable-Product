# endpoints/recommendations.py
from fastapi import APIRouter, Request
from starlette.concurrency import run_in_threadpool

from app.schemas import (
    RecommendRequest,
    RecommendResponse,
    RecommendItem
)
from app.recommender import StudentProfile

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/recommend", response_model=RecommendResponse)
async def recommend(req: RecommendRequest, request: Request):
    recommender = request.app.state.recommender

    profile = StudentProfile(
        interests_text=req.interests_text,
        preferred_location=req.preferred_location,
        preferred_level=req.preferred_level,
        credit=req.credit,
    )

    df = await run_in_threadpool(
        recommender.recommend,
        profile,
        req.k,
        req.alpha,
        req.beta,
    )

    results = [
        RecommendItem(
            module_name=row["module_name"],
            location=row.get("location"),
            level=row.get("level"),
            studycredit=row.get("studycredit"),
            content_sim=float(row["content_sim"]),
            constraint_score=float(row["constraint_score"]),
            final_score=float(row["final_score"]),
            constraint_reasons=row.get("constraint_reasons", {}),
        )
        for _, row in df.iterrows()
    ]

    return {"results": results}