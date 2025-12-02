# Frontend Dockerfile (multi-stage)
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_API_BASE=/api
RUN npm run build

# Serve stage
FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

# Copy nginx config template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Create a simple startup script
RUN echo '#!/bin/sh\
set -e\
\
# Set default values\
: "${PORT:=8080}"\
: "${BACKEND_URL:=http://localhost:8000}"\
\
# Log environment variables\
echo "Starting with PORT=$PORT"\
echo "Using BACKEND_URL=$BACKEND_URL"\
\
# Replace environment variables in nginx config\
envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf\
\
# Start nginx\
exec nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Create health check file
RUN echo "OK" > /usr/share/nginx/html/healthz

# Set environment variables
ENV PORT=8080
ENV BACKEND_URL=http://localhost:8000

# Expose port
EXPOSE 8080

# Use the entrypoint script
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
