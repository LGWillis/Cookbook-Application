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
RUN apk add --no-cache gettext \
    && mkdir -p /var/log/nginx \
    && touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && chown -R nginx:nginx /var/log/nginx \
    && chmod -R 755 /var/log/nginx

# Copy nginx config template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Create a startup script
RUN echo '#!/bin/sh\
set -e\
\
# Substitute environment variables in the nginx config\
if [ -n "$BACKEND_URL" ]; then\
  export BACKEND_URL\
  echo "Using BACKEND_URL: $BACKEND_URL"\
  envsubst "\$BACKEND_URL" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf\
else\
  echo "WARNING: BACKEND_URL not set, using default value"\
  export BACKEND_URL=http://localhost:8000\
  envsubst "\$BACKEND_URL" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf\
fi\
\
# Test the nginx configuration\
nginx -t\
\
# Start nginx\
exec nginx -g "daemon off;"' > /docker-entrypoint.sh \
&& chmod +x /docker-entrypoint.sh

# Use the PORT environment variable provided by Cloud Run
ENV PORT=8080

# Expose the port Cloud Run will use
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080 || exit 1

# Use our custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command (can be overridden)
CMD ["nginx", "-g", "daemon off;"]
