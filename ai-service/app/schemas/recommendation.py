from typing import Optional, Dict
from pydantic import BaseModel, Field

class RecommendRequest(BaseModel):
    interests_text: str = Field(..., min_length=1)
    preferred_location: Optional[str] = None
    preferred_level: Optional[str] = None
    credit: Optional[int] = None
    k: int = 10
    alpha: float = 0.5
    beta: float = 0.5

class Recommendation(BaseModel):
    module_name: str
    location: Optional[str] = None
    level: Optional[str] = None
    studycredit: Optional[int] = None
    content_sim: float
    constraint_score: float
    final_score: float
    constraint_reasons: Dict[str, str]

class RecommendResponse(BaseModel):
    results: list[Recommendation]