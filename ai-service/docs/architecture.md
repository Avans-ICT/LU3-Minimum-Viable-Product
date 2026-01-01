# Architectuur – LU3 AI Recommender Service

## Overzicht
Dit project is opgezet als een **monorepo** en bestaat uit drie hoofdcomponenten:

- **Frontend** – React applicatie voor gebruikersinteractie
- **Backend** – NestJS API voor businesslogica en orkestratie
- **AI-service** – FastAPI service verantwoordelijk voor aanbevelingen

Deze documentatie beschrijft de **architectuur van de AI-service** en haar rol binnen het geheel.

---

## Architectuurstijl
De AI-service is opgezet volgens een **service-georiënteerde architectuur** met duidelijke verantwoordelijkheden:

- Eén duidelijke taak: **inference uitvoeren**
- Geen directe afhankelijkheid van frontend
- Losgekoppeld van de backend (communicatie via HTTP)

Hierdoor kan de AI-service:
- Onafhankelijk ontwikkeld en gedeployed worden
- Later vervangen of uitgebreid worden zonder impact op andere onderdelen

---

## AI-service: verantwoordelijkheden
De AI-service is verantwoordelijk voor:

- Laden van het recommender-model bij applicatie-startup
- Valideren van input via Pydantic DTO’s
- Uitvoeren van aanbevelingen (content-based filtering)
- Teruggeven van gestructureerde resultaten
- Rapporteren van status via een health endpoint

De service **doet bewust geen**:
- Gebruikersauthenticatie
- Database writes (volgt in latere iteratie)
- Modeltraining tijdens runtime

---

## Interne structuur AI-service

```
app/
├── api/
│   ├── router.py
│   └── routers/
│       └── recommendations.py
├── core/
│   ├── config.py
│   └── logging.py
├── schemas/
│   └── recommendation.py
├── services/
│   └── recommender_service.py
├── main.py
```

### Toelichting
- **api/**: definieert HTTP endpoints
- **schemas/**: Pydantic modellen voor request/response validatie
- **services/**: domeinlogica (recommender-algoritme)
- **core/**: cross-cutting concerns (config, logging)
- **main.py**: applicatie-entrypoint en lifecycle management

---

## Datastroom (runtime)

1. Client stuurt interesses naar backend
2. Backend roept AI-service aan
3. AI-service valideert input
4. Model wordt aangeroepen voor inference
5. Resultaten worden gestructureerd teruggegeven

```
Client → Backend → AI-service → Model → Response
```

---

## Model lifecycle & serving

- Het model wordt **één keer geladen bij startup** (FastAPI lifespan)
- Model artifacts worden geladen vanuit:
  ```
  ml/artifacts/current/recommender.joblib
  ```
- Ondersteunde artifact-vormen:
  - Recommender-object met `.recommend()`
  - Dict met `tfidf`, `df`, `X_tfidf`

Dit voorkomt:
- Onnodige herinitialisatie
- Performanceproblemen per request

---

## API contract (MVP)
De AI-service biedt een stabiele interface voor inference.

- **POST** `/recommendations`
  - Request: `interests_text: str`, `k: int`, optioneel `constraints`
  - Response: `results[]` met `module_id`, `score`, `reasons` + `model_version`
- **GET** `/health`
  - Geeft status van service + loaded model_version

De service is bedoeld voor interne communicatie (Backend → AI-service) en wordt niet direct door clients aangesproken.


## Observability
- Requests worden gelogd met `request_id`, `model_version` en `latency_ms`.
- Errors bevatten een trace-id zodat issues terug te vinden zijn in logs.

---

## Keuzes & motivatie

### Waarom FastAPI?
- Hoge performance
- Sterke typing met Pydantic
- Uitstekende ondersteuning voor async
- Automatische OpenAPI documentatie

### Waarom aparte AI-service?
- Scheiding van verantwoordelijkheden
- Schaalbaarheid
- Duidelijke ownership van AI-logica

### Waarom geen training in de API?
- Training is resource-intensief
- Beter geschikt voor offline pipelines
- Vermijdt instabiliteit tijdens inference

---

## Toekomstige uitbreidingen
De architectuur is voorbereid op:

- Logging van recommendation events
- Feedback endpoints (like/dislike)
- Dataset generatie voor retraining
- Model versioning & A/B testing
- CI/CD pipelines

Deze onderdelen zijn bewust **nog niet geïmplementeerd** en worden iteratief toegevoegd.

---

## Status van dit document
**Status:** In Progress  
Dit document beschrijft de huidige architectuur en wordt uitgebreid naarmate functionaliteit wordt toegevoegd.