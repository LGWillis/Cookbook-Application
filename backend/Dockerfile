# Backend Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps for psycopg2 and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    netcat-openbsd \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pre-copy requirements to leverage Docker cache
COPY backend/requirements-docker.txt /app/requirements.txt

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Project files
COPY backend /app

# Collect static (noop now), ensure media dir
RUN mkdir -p /app/media /app/staticfiles

# Entrypoint to run migrations and server
COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

CMD ["/entrypoint.sh"]
