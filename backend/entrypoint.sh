#!/bin/sh
set -e

# Debug: Print environment variables
echo "=== Environment Variables ==="
printenv | sort
echo "==========================="

# Check for DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
  echo "Using DATABASE_URL for database connection"
  # Extract database components from DATABASE_URL for debugging
  DB_PROTOCOL=$(echo $DATABASE_URL | grep '://' | sed -e's,^\(.*://\).*,\1,g')
  DB_URL=$(echo $DATABASE_URL | sed -e s,$DB_PROTOCOL,,g)
  DB_USER=$(echo $DB_URL | grep @ | cut -d@ -f1 | cut -d: -f1)
  DB_HOST_PORT=$(echo $DB_URL | grep @ | cut -d@ -f2 | cut -d/ -f1)
  DB_HOST=$(echo $DB_HOST_PORT | cut -d: -f1)
  DB_PORT=$(echo $DB_HOST_PORT | cut -d: -f2)
  DB_NAME=$(echo $DB_URL | grep / | cut -d/ -f2- | cut -d? -f1)
  
  echo "Database Details:"
  echo "- Protocol: $DB_PROTOCOL"
  echo "- Host: $DB_HOST"
  echo "- Port: $DB_PORT"
  echo "- Database: $DB_NAME"
  
  # Wait for database if host and port are available
  if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
    echo "Waiting for database $DB_HOST:$DB_PORT..."
    until nc -z "$DB_HOST" "$DB_PORT"; do
      echo "Waiting for database..."
      sleep 2
    done
    echo "Database is up!"
  fi
else
  echo "WARNING: DATABASE_URL not set. Database connection might fail."
fi

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput || { echo "Failed to run migrations"; exit 1; }

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput || echo "Warning: Failed to collect static files"

# Start Gunicorn with better error handling
echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 2 \
  --timeout 120 \
  --log-level=info \
  --access-logfile - \
  --error-logfile -
