from dataclasses import dataclass
from typing import Optional, Dict, Any, Tuple, List

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

@dataclass
class StudentProfile:
    """Student Profile"""
    interests_text: str
    preferred_location: Optional[str] = None
    preferred_level: Optional[str] = None
    credit: Optional[int] = None

class ContentBasedRecommender:
    def __init__(self, tfidf, df:pd.DataFrame, X_tfidf):
        self.tfidf = tfidf
        self.df = df.reset_index(drop=True)
        self.X_tfidf = X_tfidf

    #TODO: scores accurater / eerlijker maken
    def _constraint_score(self, row: pd.Series, profile: StudentProfile) -> Tuple[float, Dict[str, str]]:
        """
        Simpele constraint-score zoals in notebook:
        matchende voorkeuren => hogere score + uitleg voor explainability.
        """
        score = 0.0
        reasons: Dict[str, str] = {}

        # Als voorkeuren matchen met modules krijgen ze een beetje extra score
        if profile.preferred_location and "location" in row and pd.notna(row["location"]):
            if str(row["location"]).lower() == profile.preferred_location.lower():
                score += 0.5
                reasons["location"] = "Locatie matcht voorkeur."

        if profile.preferred_level and "level" in row and pd.notna(row["level"]):
            if str(row["level"]).lower() == profile.preferred_level.lower():
                score += 0.3
                reasons["level"] = "Niveau matcht voorkeur."

        if profile.credit is not None and "studycredit" in row and pd.notna(row["studycredit"]):
            try:
                if int(row["studycredit"]) == int(profile.credit):
                    score += 0.2
                    reasons["credit"] = "Studiepunten matchen voorkeur."
            except Exception:
                pass

        return float(score), reasons
    
    def recommend(self, profile: StudentProfile, k: int = 10, alpha: float = 0.5, beta: float = 0.5) -> pd.DataFrame:
        # Alpha + beta moet altijd gelijk zijn aan 1
        if not np.isclose(alpha + beta, 1.0):
            raise ValueError("Alpha + beta moet gelijk zijn aan 1")
        
        # Student Profile vectoriseren
        profile_vec = self.tfidf.transform([profile.interests_text])

        # Cosine similarity met alle modules
        similarities = cosine_similarity(profile_vec, self.X_tfidf).flatten()

        records: List[Dict[str, Any]] = []
        for idx, row in self.df.iterrows():
            c_score = float(similarities[idx])
            cstr_score, reasons = self._constraint_score(row, profile)
            final_score = alpha * c_score + beta * cstr_score

            records.append({
                "module_name": row.get("name", ""),
                "location": row.get("location", None),
                "level": row.get("level", None),
                "studycredit": row.get("studycredit", None),
                "content_sim": c_score,
                "constraint_score": cstr_score,
                "final_score": final_score,
                "constraint_reasons": reasons,
            })

        recs = pd.DataFrame(records).sort_values("final_score", ascending=False).reset_index(drop=True)
        return recs.head(k)