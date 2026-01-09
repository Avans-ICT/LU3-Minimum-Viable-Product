# AI Service — FastAPI Recommender

Deze map bevat de **AI-service** van het LU3 MVP-project.  
De service is een **stateless FastAPI microservice** die aanbevelingen genereert op basis van een **getraind content-based recommender model** (TF-IDF).

De AI-service wordt **niet direct door de frontend aangesproken**, maar **asynchroon aangeroepen door de backend** als onderdeel van het recommendation-event flow.

---

## Rol binnen het totale systeem

De AI-service is verantwoordelijk voor:

- Laden van het **ML-artifact** bij startup
- Genereren van aanbevelingen op basis van:
  - vrije tekst (interesses)
  - model-parameters (k, wegingen)
- Teruggeven van **deterministische, reproduceerbare aanbevelingen**
- Geen gebruikerscontext, authenticatie of sessiestatus

**Wat deze service niet doet:**

- Geen JWT / auth
- Geen database writes
- Geen event-tracking of feedbackverwerking
- Geen business-logica (dat zit in de backend)

---

## Architectuur-overzicht (conceptueel)

```
Frontend
   ↓
Backend (NestJS)
   ├─ maakt RecommendationEvent (PENDING)
   ├─ enqueued job (async)
   ↓
AI Service (FastAPI)
   ├─ laadt recommender artifact bij startup
   ├─ berekent recommendations
   ↓
Backend
   ├─ slaat resultaten op
   └─ zet event op COMPLETED
```

---

## Vereisten

- **Python 3.11+**
- `pip`
- (optioneel) Postman of curl

---

## Projectstructuur (globaal)

```
ai-service/
  app/
    api/
    core/
    services/
    main.py
  ml/
    artifacts/
      current/
    notebooks/
    training/
    pipeline/
  docs/
  requirements.txt
  .env.example
```

---

## Installatie

```bash
cd ai-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## Configuratie

```bash
cp .env.example .env
```

Belangrijke variabelen:

```env
MODEL_ARTIFACT_PATH=ml/artifacts/current
MODEL_VERSION=baseline
LOG_LEVEL=INFO
```

---

## Model artifacts

De AI-service verwacht **exact één actief artifact** in:

```
ml/artifacts/current/recommender.joblib
```

### Ondersteunde artifact-vormen

Bij startup wordt het artifact geladen en automatisch geïnterpreteerd:

1. **Direct recommender-object**
   - Heeft een `.recommend()` methode
   - Wordt direct gebruikt

2. **Dictionary-artifact**
   Met minimaal:
   - `tfidf` of `vectorizer`
   - `df` of `modules_df`
   - `X_tfidf`

De service bouwt hieruit intern een `ContentBasedRecommender`.

---

## Startup & lifecycle

1. Model-artifact wordt **éénmalig geladen**
2. Recommender blijft in memory
3. Alle requests delen hetzelfde model
4. Geen reload per request

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

### POST `/recommendations/recommend`

**Request body:**

```json
{
  "interests_text": "ai security ethical hacking",
  "k": 5,
  "alpha": 0.8,
  "beta": 0.2
}
```

**Betekenis:**

- `interests_text` – samengevoegde interesse-tekst
- `k` – aantal aanbevelingen
- `alpha / beta` – interne wegingen

**Response (voorbeeld):**

```json
{
  "items": [
    {
      "moduleId": "35345235235",
      "score": 0.82
    }
  ]
}
```

---

## Foutafhandeling

- `500` – model niet geladen / corrupt
- `422` – invalid input
- `503` – service nog niet klaar

---

## Development-afspraken

- Geen `venv/`, `__pycache__/` of `.env` committen
- Notebooks alleen voor research
- Productiecode uitsluitend in `app/`
- Training ≠ runtime
- Alleen `artifacts/current` is actief

---

## Belangrijk

- Backend is de enige consumer
- Model is hot-swappable
- Service is puur inference