# AI Service (FastAPI Recommender)

Deze map bevat de **AI-service** van het LU3 MVP-project.  
De service biedt een FastAPI API die aanbevelingen kan genereren op basis van een getraind recommender-model (`recommender.joblib`).

---

## Vereisten

- **Python 3.11+**
- `pip`
- (optioneel) Postman of curl

---

## Projectstructuur (kort)

```
ai-service/
  app/
  ml/
    artifacts/
      current/
    notebooks/
    pipeline/
    training/
  docs/
  requirements.txt
  .env.example
```

---

## Installatie

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: python -m venv venv
pip install -r requirements.txt
```

---

## Configuratie

```bash
cp .env.example .env
```

Belangrijke variabelen:
- `MODEL_ARTIFACT_PATH=ml/artifacts/current`
- `MODEL_VERSION=baseline`

---

## Model artifacts

De API verwacht:

```
ai-service/ml/artifacts/current/recommender.joblib
```

Het artifact mag zijn:
- een object met `.recommend()`
- of een dict met `tfidf`, `df`, `X_tfidf`

---

## Starten van de API

```bash
uvicorn app.main:app --reload
```

- API: http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

---

## Endpoint: Recommendations

**POST** `/recommendations/recommend`

```json
{
  "interests_text": "security netwerken ethical hacking",
  "k": 5,
  "alpha": 0.8,
  "beta": 0.2
}
```

---

## Development afspraken

- Geen `venv/`, `__pycache__/` of `.env` committen
- Notebooks alleen voor onderzoek
- Productiecode in `app/`

---