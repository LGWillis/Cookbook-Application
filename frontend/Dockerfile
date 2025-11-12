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
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
