from contextlib import asynccontextmanager
import logging
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging import setup_logging
from app.api.router import router
from app.services.recommender_service import ContentBasedRecommender

logger = logging.getLogger(__name__)

def _build_recommender_from_artifact(loaded: object) -> ContentBasedRecommender:
    # Case 1: already an object with recommend()
    if hasattr(loaded, "recommend"):
        return loaded  # type: ignore[return-value]

    # Case 2: dict artifact
    if isinstance(loaded, dict):
        tfidf = loaded.get("tfidf")
        if tfidf is None:
            tfidf = loaded.get("vectorizer")

        df = loaded.get("df")
        if df is None:
            df = loaded.get("modules_df")

        X_tfidf = loaded.get("X_tfidf")
        if X_tfidf is None:
            X_tfidf = loaded.get("matrix")

        if tfidf is None or df is None or X_tfidf is None:
            raise RuntimeError(
                "Artifact dict missing required keys. "
                f"Found keys: {list(loaded.keys())}. "
                "Expected: tfidf (or vectorizer), df (or modules_df), X_tfidf (or matrix)."
            )

        if not isinstance(df, pd.DataFrame):
            df = pd.DataFrame(df)

        return ContentBasedRecommender(tfidf=tfidf, df=df, X_tfidf=X_tfidf)

    raise RuntimeError(f"Unsupported artifact type: {type(loaded)}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan hook:
    - Load settings
    - Load/rebuild ML recommender once at startup
    """
    settings = get_settings()
    app.state.settings = settings

    artifact_dir = Path(settings.model_artifact_path)
    model_path = artifact_dir / "recommender.joblib"

    try:
        if model_path.exists():
            loaded = joblib.load(model_path)

            # Helpful log for debugging (won't crash if not dict)
            if isinstance(loaded, dict):
                logger.info(f"Artifact loaded as dict with keys: {list(loaded.keys())}")
            else:
                logger.info(f"Artifact loaded as type: {type(loaded)}")

            app.state.recommender = _build_recommender_from_artifact(loaded)
            logger.info(
                f"Recommender ready from {model_path} "
                f"(version={settings.model_version})"
            )
        else:
            app.state.recommender = None
            logger.warning(
                f"No recommender found at {model_path}. "
                "Recommendation endpoint will return 503."
            )

        yield

    except Exception as e:
        # If startup fails, still allow app to start for debugging/health,
        # but recommender will be None (endpoints should return 503).
        app.state.recommender = None
        logger.exception(f"Failed to initialize recommender: {e}")
        yield


def create_app() -> FastAPI:
    """
    Application factory.
    """
    settings = get_settings()
    setup_logging(settings.app_env)

    app = FastAPI(
        title=settings.app_name,
        lifespan=lifespan,
    )

    # --- CORS ---------------------------------------------------------------
    origins = (
        ["*"]
        if settings.cors_origins.strip() == "*"
        else [
            origin.strip()
            for origin in settings.cors_origins.split(",")
            if origin.strip()
        ]
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Routers ------------------------------------------------------------
    app.include_router(router, prefix=settings.api_prefix)

    # --- Health -------------------------------------------------------------
    @app.get("/health", tags=["health"])
    def health():
        return {
            "status": "ok",
            "env": settings.app_env,
            "model_version": settings.model_version,
            "recommender_loaded": app.state.recommender is not None,
        }

    return app


# ASGI entrypoint
app = create_app()