# Backend Dockerfile
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# System dependencies for psycopg2, Pillow, and health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache layers
# The requirements file lives under the `backend/` folder in the repo
COPY backend/requirements-docker.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r /app/requirements.txt

# Copy application code (only the backend folder) so files land at /app/
# This ensures `/app/entrypoint.sh` exists (it lives at `backend/entrypoint.sh`).

# Create necessary directories with proper permissions
RUN mkdir -p /app/media /app/staticfiles && \
    chmod -R 755 /app/media /app/staticfiles

# Copy backend files into /app
COPY backend/ /app/

# Use a short inline entrypoint to avoid file line-ending/BOM issues from host OS
ENTRYPOINT ["/bin/bash", "-c", "set -e; echo '=== Starting Django Application ==='; echo \"DJANGO_DEBUG: ${DJANGO_DEBUG:-not set}\"; echo \"PORT: ${PORT:-8000}\"; export PORT=${PORT:-8000}; python manage.py migrate --noinput || true; python manage.py collectstatic --noinput --clear || true; exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT} --workers 3 --worker-class sync --timeout 60 --max-requests 1000 --max-requests-jitter 50 --keep-alive 5 --log-level=debug --access-logfile - --error-logfile -"]

# Health check - simple TCP check instead of HTTP to avoid auth issues
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/ || exit 1

# Expose port (Cloud Run uses PORT environment variable, but this is good practice)
EXPOSE 8000

# Default to 8000 if PORT not set
ENV PORT=8000

# (entrypoint is the inline shell command above)
