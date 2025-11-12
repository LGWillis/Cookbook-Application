#!/usr/bin/env sh
set -e

host="$DB_HOST"
port="$DB_PORT"

if [ -n "$host" ] && [ -n "$port" ]; then
  echo "Waiting for database $host:$port..."
  until nc -z "$host" "$port"; do
    sleep 1
  done
  echo "Database is up"
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120 || python manage.py runserver 0.0.0.0:8000
