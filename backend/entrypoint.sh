#!/usr/bin/env sh
set -e

# Debug: Print environment variables
echo "=== Environment Variables ==="
printenv | sort
echo "==========================="

# Wait for database if DB_HOST is set
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
  echo "Waiting for database $DB_HOST:$DB_PORT..."
  until nc -z "$DB_HOST" "$DB_PORT"; do
    echo "Waiting for database..."
    sleep 2
  done
  echo "Database is up!"
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
