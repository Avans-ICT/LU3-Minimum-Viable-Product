    # syntax=docker/dockerfile:1

FROM python:3.13-slim

# Voorkomt .pyc, zorgt voor unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (pandas/scikit-learn bouwen soms wheels nodig; slim houdt het klein)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Dependencies eerst (betere Docker cache)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# App code
COPY . /app

# (optioneel) maak folders die je code verwacht
RUN mkdir -p /app/logs /app/ml/artifacts

# Non-root user (best practice)
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Start FastAPI
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]