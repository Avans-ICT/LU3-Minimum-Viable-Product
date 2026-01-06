# Project Setup — Terminal Commands Overview

## Backend (NestJS + Mongo + JWT)

### In `/backend`
```bash
npm init -y
npm i -g @nestjs/cli
nest new backend-app
```

### In `/backend/backend-app`
```bash
npm i @nestjs/mongoose mongoose
npm i @nestjs/passport passport @nestjs/jwt passport-jwt cookie-parser
npm i -D @types/passport-jwt @types/cookie-parser
npm run start:dev
mkdir logs && touch logs/app.log logs/error.log
```

---

## Frontend (React + Vite + TypeScript)

### In `/frontend`
```bash
npm create vite@latest frontend-app -- --template react-ts
```

### In `/frontend/frontend-app`
```bash
npm install
npm install react-router-dom
npm run dev
```

---

## AI-Service (FastAPI)

### In `/ai-service`
```bash
python -m venv venv
```

**Virtual environment activeren:**

```bash
venv\Scripts\activate
```

### Vervolgens in dezelfde map (`/ai-service`)
```bash
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

---

## Compleet Overzicht

| Map | Command | Beschrijving |
|------|---------|--------------|
| `/backend` | `npm init -y` | Initieert backend package |
| `/backend` | `npm i -g @nestjs/cli` | Installeert Nest CLI |
| `/backend` | `nest new backend-app` | Genereert Nest project |
| `/backend/backend-app` | `npm i @nestjs/mongoose mongoose` | MongoDB dependencies |
| `/backend/backend-app` | `npm i @nestjs/passport passport @nestjs/jwt passport-jwt cookie-parser` | JWT & Auth libraries |
| `/backend/backend-app` | `npm i -D @types/passport-jwt @types/cookie-parser` | TS type-definities |
| `/backend/backend-app` | `npm run start:dev` | Start backend server |
| `/backend/backend-app` | `mkdir logs && touch logs/app.log logs/error.log` | maak log bestanden aan voor logging |
| `/frontend` | `npm create vite@latest frontend-app -- --template react-ts` | Genereert React project |
| `/frontend/frontend-app` | `npm install` | Installeert dependencies |
| `/frontend/frontend-app` | `npm install react-router-dom` | Installeert router |
| `/frontend/frontend-app` | `npm run dev` | Start frontend server |
| `/ai-service` | `python -m venv venv` | Maakt virtualenv |
| `/ai-service` | .\venv\Scripts\activate | Activeert geïsoleerde omgeving |
| `/ai-service` | `pip install fastapi uvicorn` | Installeert FastAPI |
| `/ai-service` | `uvicorn main:app --reload --port 8000` | Start AI-service |
