from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    label: str
    confidence: float

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    # TODO: roep model aan
    return PredictResponse(label="dummy", confidence=0.99)