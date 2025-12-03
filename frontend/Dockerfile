# Frontend Dockerfile (multi-stage)
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Accept a build argument so the API base can be set from docker-compose
ARG VITE_API_BASE=/api
# Export as env so the build step (and Vite) pick it up
ENV VITE_API_BASE=${VITE_API_BASE}

RUN npm run build

# Serve stage
FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

# Copy nginx config template
COPY ./nginx.conf /etc/nginx/nginx.conf.template

# Copy entrypoint script and convert CRLF to LF, then make executable
COPY ./docker-entrypoint.sh /tmp/entrypoint.sh
RUN tr -d '\r' < /tmp/entrypoint.sh > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh && rm /tmp/entrypoint.sh

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Create health check file
RUN echo "OK" > /usr/share/nginx/html/healthz

# Set environment variables
ENV BACKEND_URL=http://localhost:8000

# Nginx listens on port 80 in the provided config
EXPOSE 80

# Use the entrypoint script
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
