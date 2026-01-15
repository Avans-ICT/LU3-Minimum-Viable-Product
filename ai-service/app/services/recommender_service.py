from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Dict, Any, Tuple, List

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from app.services.recommender_service import normalize_text


@dataclass
class StudentProfile:
    """Student Profile"""
    interests_text: str
    preferred_location: Optional[str] = None
    preferred_level: Optional[str] = None
    credit: Optional[int] = None


class ContentBasedRecommender:
    """
    Content-based recommender (TF-IDF cosine similarity) + constraints.

    Upgrade:
    - Supports feature_names in artifact to generate content-based explanations ("content_match")
    - Backwards compatible: if feature_names missing => no content reasons.
    """

    def __init__(self, tfidf, df: pd.DataFrame, X_tfidf, feature_names: Optional[np.ndarray] = None):
        self.tfidf = tfidf
        self.df = df.reset_index(drop=True)
        self.X_tfidf = X_tfidf
        self.feature_names = feature_names  # may be None for older artifacts

    def _constraint_score(self, row: pd.Series, profile: StudentProfile) -> Tuple[float, Dict[str, str]]:
        """
        Simpele constraint-score:
        matchende voorkeuren => hogere score + uitleg.
        """
        score = 0.0
        reasons: Dict[str, str] = {}

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

    def _content_reason(
        self,
        profile_vec,
        module_idx: int,
        top_k_terms: int = 8,
        min_terms: int = 1,
    ) -> Optional[Dict[str, Any]]:
        """
        Inhoudelijke reason obv overlappende TF-IDF features.
        Fallback: als overlap leeg is, toon top-termen van user + module (zonder te claimen dat ze exact overlappen).
        """
        if self.feature_names is None:
            return None

        def top_terms(vec_1xN, k: int) -> List[str]:
            arr = vec_1xN.toarray()[0]
            nz = np.flatnonzero(arr)
            if nz.size == 0:
                return []
            # sort nonzero indices by weight
            idx_sorted = nz[np.argsort(arr[nz])][::-1][:k]
            terms = []
            for i in idx_sorted:
                term = str(self.feature_names[i])
                # accept 2-letter terms like "ai"
                if len(term) < 2:
                    continue
                terms.append(term)
            # de-dup
            return list(dict.fromkeys(terms))

        try:
            user_arr = profile_vec.toarray()[0]
            mod_vec = self.X_tfidf[module_idx]
            mod_arr = mod_vec.toarray()[0] if hasattr(mod_vec, "toarray") else np.asarray(mod_vec).ravel()

            overlap = user_arr * mod_arr
            top_indices = np.argsort(overlap)[-top_k_terms:][::-1]

            keywords: List[str] = []
            for i in top_indices:
                if overlap[i] <= 0:
                    continue
                term = str(self.feature_names[i])
                if len(term) < 2:
                    continue
                keywords.append(term)

            keywords = list(dict.fromkeys(keywords))

            # Primary: real overlap keywords
            if len(keywords) >= min_terms:
                pretty = ", ".join(keywords[:4])
                return {
                    "type": "content_match",
                    "keywords": keywords[:6],
                    "explanation": f"De inhoud sluit aan op je interesses doordat zowel jouw input als de module focussen op: {pretty}.",
                }

            # Fallback: show context terms (no hard overlap claim)
            user_terms = top_terms(profile_vec, k=4)
            mod_terms = top_terms(mod_vec, k=4)

            if user_terms and mod_terms:
                return {
                    "type": "content_context",
                    "userKeywords": user_terms,
                    "moduleKeywords": mod_terms,
                    "explanation": (
                        f"Je interesses bevatten o.a.: {', '.join(user_terms)}. "
                        f"Deze module behandelt o.a.: {', '.join(mod_terms)}."
                    ),
                }

            return None
        except Exception:
            return None

    def recommend(
        self,
        profile: StudentProfile,
        k: int = 10,
        alpha: float = 0.7,
        beta: float = 0.3,
    ) -> pd.DataFrame:
        # Alpha + beta always has to be equal to 1
        if not np.isclose(alpha + beta, 1.0):
            raise ValueError("Alpha + beta moet gelijk zijn aan 1")

        clean_input = normalize_text(profile.interests_text)
        profile_vec = self.tfidf.transform([clean_input])
        similarities = cosine_similarity(profile_vec, self.X_tfidf).flatten()

        records: List[Dict[str, Any]] = []
        for idx, row in self.df.iterrows():
            c_score = float(similarities[idx])
            cstr_score, constraint_reasons = self._constraint_score(row, profile)
            final_score = alpha * c_score + beta * cstr_score

            content_reason = self._content_reason(profile_vec, module_idx=int(idx))

            # unified reasons payload (used by integration endpoint)
            reasons: Dict[str, Any] = {}
            if constraint_reasons:
                reasons["constraints"] = constraint_reasons
            if content_reason:
                reasons["content"] = content_reason

            records.append({
                # IMPORTANT for backend integration (ERD requires modules._id reference)
                "module_id": row.get("module_id") or row.get("_id") or row.get("id"),
                "module_name": row.get("name", ""),
                "location": row.get("location", None),
                "level": row.get("level", None),
                "studycredit": row.get("studycredit", None),
                "content_sim": c_score,
                "constraint_score": float(cstr_score),
                "final_score": float(final_score),
                "constraint_reasons": constraint_reasons,
                "reasons": reasons if reasons else None,
            })

        recs = pd.DataFrame(records).sort_values("final_score", ascending=False).reset_index(drop=True)
        return recs.head(k)