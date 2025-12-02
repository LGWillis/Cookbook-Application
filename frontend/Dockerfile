# Frontend Dockerfile (multi-stage)
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
# Build with API base configured for Docker network
ARG VITE_API_BASE=http://backend:8000
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

# Serve stage
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy nginx config template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Create a startup script that will generate the nginx config with the current environment
RUN echo '#!/bin/sh \n\
# Substitute environment variables in the nginx config\n  envsubst "`printf "$%s" $(bash -c "compgen -A variable")`" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf \n\
# Start nginx\n  exec nginx -g "daemon off;"' > /docker-entrypoint.sh \
  && chmod +x /docker-entrypoint.sh

# Use the PORT environment variable provided by Cloud Run
ENV PORT=8080

# Expose the port Cloud Run will use
EXPOSE $PORT

# Use our custom entrypoint script
CMD ["/docker-entrypoint.sh"]
