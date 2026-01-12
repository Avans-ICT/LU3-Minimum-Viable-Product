from fastapi import APIRouter, Request
from starlette.concurrency import run_in_threadpool

from app.schemas.recommendation import RecommendRequest, RecommendResponse, Recommendation
from app.services.recommender_service import StudentProfile

router = APIRouter()

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

    results = []
    for _, row in df.iterrows():
        module_id = row.get("module_id") or row.get("_id") or row.get("id")
        if not module_id:
            module_id = "unknown"

        results.append(
            Recommendation(
                module_id=str(module_id),
                module_name=row.get("module_name", ""),
                location=row.get("location"),
                level=row.get("level"),
                studycredit=row.get("studycredit"),
                content_sim=float(row.get("content_sim", 0.0)),
                constraint_score=float(row.get("constraint_score", 0.0)),
                final_score=float(row.get("final_score", 0.0)),
                constraint_reasons=row.get("constraint_reasons", {}) or {},
                reasons=row.get("reasons", None),
            )
        )

    return {"results": results}