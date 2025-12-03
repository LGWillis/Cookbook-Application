#!/bin/sh
PORT="${PORT:-8080}"
BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
echo "Starting with PORT=$PORT"
echo "Using BACKEND_URL=$BACKEND_URL"
cp /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf
nginx -g "daemon off;"
