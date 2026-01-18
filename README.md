# LU3 Minimum Viable Product — Group 9

Dit project is ontwikkeld binnen **Avans Hogeschool – ICT LU3** en betreft een **full-stack Minimum Viable Product** dat studenten ondersteunt bij het kiezen van keuzemodules binnen de vrije keuzeruimte.  
De applicatie combineert een webinterface met een **AI-ondersteund aanbevelingssysteem**, waarbij de AI uitsluitend adviserend is en de student altijd zelf de uiteindelijke keuze maakt.

---

## Repository structuur

```
/
├─ frontend/
│  └─ frontend-app/        # React (Vite + TypeScript)
├─ backend/
│  └─ backend-app/         # NestJS API + MongoDB + JWT (cookies)
├─ ai-service/             # FastAPI AI-service (recommender)
└─ README.md
```

Redis wordt gebruikt voor **asynchrone verwerking** (queue/worker) van aanbevelingsverzoeken.

---

## Vereisten

- **Node.js** 18+ (inclusief npm)
- **Python** 3.10+
- **MongoDB** (lokaal of MongoDB Atlas)
- **Docker Desktop** (alleen vereist voor Redis)
- (Optioneel) Git

---

## Environment variables

### Backend — `/backend/backend-app/.env`

```env
MONGODB_URI=...
JWT_SECRET=...

AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=...

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

### Frontend — `/frontend/frontend-app/.env`

```env
VITE_API_URL=http://localhost:3000
```

---

### AI-service — `/ai-service/.env`

```env
APP_ENV=development
APP_NAME=AI Recommender MVP
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
CORS_ORIGINS=*
MODEL_ARTIFACT_PATH=ml/artifacts/current
MODEL_VERSION=baseline
```
## AI-model artefact (verplicht bij eerste run)

De AI-service verwacht bij het opstarten een vooraf gegenereerd model-artefact op het pad:
`ai-service/ml/artifacts/current`


Mits deze map nog niet aanwezig is in de repository, moet deze handmatig worden aangemaakt.

### Eerste keer opstarten
Bij de eerste run moet het model handmatig worden gegenereerd door het Jupyter notebook uit te voeren: `ai-service/ml/notebooks/Recommender.ipynb`


Na het uitvoeren van dit notebook wordt het model opgeslagen in: `ai-service/ml/artifacts/current`


---

## Lokaal draaien

### Redis (Docker)

```bash
docker pull redis:7
docker run -d --name redis -p 6379:6379 redis:7
```

### Backend

```bash
cd backend/backend-app
npm install
npm run start:dev
```

### AI-service

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Opmerking
Het trainen van het model is alleen vereist bij de eerste setup of wanneer het model opnieuw gegenereerd moet worden.

### Frontend

```bash
cd frontend/frontend-app
npm install
npm run dev
```

---

## Quick check

- Frontend: http://localhost:5173  
- Backend: http://localhost:3000  
- AI-service: http://localhost:8000/docs  

---

## Security notes

- Secrets worden niet gecommit
- AI is adviserend en niet beslissend