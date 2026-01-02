# ai-service/app/api/routers/integration_recommendations.py
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from starlette.concurrency import run_in_threadpool

from app.api.deps import require_api_key
from app.core.config import get_settings
from app.schemas.integration import (
    AiRecommendationRequest,
    AiRecommendationResponse,
    AiRecommendationResult,
)
from app.services.recommender_service import StudentProfile

router = APIRouter()


@router.post(
    "",
    response_model=AiRecommendationResponse,
    dependencies=[Depends(require_api_key)],
)
async def recommend_for_backend(req: AiRecommendationRequest, request: Request):
    """
    Backend integration endpoint.

    URL shape (because router prefix is /recommendations):
      POST /recommendations

    Expects backend-owned contract:
      { requestId, sessionId, userId, k, input:{ interestsText, constraints{...} } }

    Returns:
      { algorithm, modelVersion, results:[{moduleId, rank, score, reasons}] }
    """
    settings = get_settings()
    recommender = request.app.state.recommender

    if recommender is None:
        raise HTTPException(status_code=503, detail="Recommender not loaded")

    constraints = req.input.constraints

    profile = StudentProfile(
        interests_text=req.input.interestsText,
        preferred_location=(constraints.location if constraints else None),
        preferred_level=(constraints.level if constraints else None),
        credit=None,  # your current recommender expects an exact credit; backend uses min/max
    )

    # MVP: map credits range to a single value only if min==max
    if constraints and constraints.studycreditsMin is not None and constraints.studycreditsMax is not None:
        if constraints.studycreditsMin == constraints.studycreditsMax:
            profile.credit = constraints.studycreditsMin

    # Defaults for alpha/beta come from settings if you later add them;
    # for now keep your recommender defaults (0.5, 0.5)
    alpha = getattr(settings, "default_alpha", 0.5)
    beta = getattr(settings, "default_beta", 0.5)

    try:
        df = await run_in_threadpool(
            recommender.recommend,
            profile,
            req.k,
            alpha,
            beta,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {e}")

    results: list[AiRecommendationResult] = []

    for i, (_, row) in enumerate(df.iterrows(), start=1):
        module_id = row.get("module_id") or row.get("_id") or row.get("id") or row.get("moduleId")
        if not module_id:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Recommender output missing module_id. "
                    "Add module_id/_id to the artifact dataframe so results can reference Mongo modules._id."
                ),
            )

        score = row.get("final_score")
        if score is None:
            score = row.get("score", 0.0)

        reasons = row.get("constraint_reasons", None)

        results.append(
            AiRecommendationResult(
                moduleId=str(module_id),
                rank=int(i),
                score=float(score),
                reasons=reasons,
            )
        )

    return AiRecommendationResponse(
        algorithm=getattr(settings, "algorithm_name", "content_based"),
        modelVersion=settings.model_version,
        results=results,
    )