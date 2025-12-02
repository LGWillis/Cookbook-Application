#!/bin/bash
set -e

# Debug: Print essential environment variables
echo "=== Starting Django Application ==="
echo "DJANGO_DEBUG: ${DJANGO_DEBUG:-not set}"
echo "DJANGO_SETTINGS_MODULE: ${DJANGO_SETTINGS_MODULE:-not set}"
echo "PORT: ${PORT:-8000}"

# Ensure PORT is set for Cloud Run
export PORT=${PORT:-8000}

# Check for DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
  echo "✓ DATABASE_URL is configured"
  
  # Wait for database with timeout
  echo "Checking database connectivity..."
  DB_READY=0
  for i in {1..30}; do
    if python manage.py dbshell < /dev/null 2>&1 | grep -q "psql\|sqlite"; then
      echo "✓ Database is reachable"
      DB_READY=1
      break
    fi
    echo "  Attempt $i/30 - waiting for database..."
    sleep 1
  done
  
  if [ $DB_READY -eq 0 ]; then
    echo "⚠ Warning: Could not verify database connection, but continuing..."
  fi
else
  echo "ℹ No DATABASE_URL set, using SQLite"
fi

# Run database migrations
echo "Running database migrations..."
if python manage.py migrate --noinput; then
  echo "✓ Migrations completed successfully"
else
  echo "⚠ Warning: Migration encountered issues, continuing anyway..."
fi

# Collect static files (with better error handling)
echo "Collecting static files..."
if python manage.py collectstatic --noinput --clear 2>&1 | tail -5; then
  echo "✓ Static files collected"
else
  echo "⚠ Warning: Static file collection had issues"
fi

# Verify the application can start
echo "Testing Django app startup..."
if python -c "import django; django.setup(); print('✓ Django initialized successfully')" 2>&1; then
  :
else
  echo "⚠ Warning: Django initialization test failed"
fi

# Start Gunicorn with verbose logging
echo "================================"
echo "Starting Gunicorn on 0.0.0.0:${PORT}"
echo "================================"

exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:${PORT} \
  --workers 3 \
  --worker-class sync \
  --timeout 60 \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --keep-alive 5 \
  --log-level=debug \
  --access-logfile - \
  --error-logfile - \
  --access-log-format='%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s' 2>&1
