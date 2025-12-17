from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import joblib

from app.router import router
from app.recommender import ContentBasedRecommender

@asynccontextmanager
async def lifespan(app: FastAPI):
    bundle = joblib.load("artifacts/recommender.joblib")
    app.state.recommender = ContentBasedRecommender(
        tfidf=bundle["tfidf"],
        df=bundle["df"],
        X_tfidf=bundle["X_tfidf"],
    )
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "AI service running", "docs": "/docs"}

BASE_DIR = Path(__file__).resolve().parent
FAVICON_PATH = BASE_DIR / "favicon.ico"

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(FAVICON_PATH)