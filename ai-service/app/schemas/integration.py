from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel, Field


class AiConstraints(BaseModel):
    location: Optional[str] = None
    level: Optional[str] = None
    studycreditsMin: Optional[int] = None
    studycreditsMax: Optional[int] = None


class AiInput(BaseModel):
    interestsText: str = Field(..., min_length=1)
    constraints: Optional[AiConstraints] = None


class AiRecommendationRequest(BaseModel):
    requestId: str = Field(..., min_length=1)
    sessionId: str = Field(..., min_length=1)
    userId: str = Field(..., min_length=1)
    k: int = Field(default=10, ge=1, le=100)
    input: AiInput


class AiRecommendationResult(BaseModel):
    moduleId: str
    rank: int
    score: float
    reasons: Optional[dict[str, Any]] = None


class AiRecommendationResponse(BaseModel):
    algorithm: str
    modelVersion: str
    results: list[AiRecommendationResult]