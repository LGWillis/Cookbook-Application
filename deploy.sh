#!/bin/bash
set -e

# Cloud Run Deployment Script
# Update the variables below with your actual values

PROJECT_ID="jovial-opus-475817-g1"
REGION="us-central1"
IMAGE_URL="gcr.io/jovial-opus-475817-g1/cookbook-backend"
FRONTEND_URL="https://cookbook-frontend-816722964208.us-central1.run.app"
DATABASE_URL="postgresql://cookbook:Budsadie2$@35.226.213.9:5432/cookbook"
COMMIT_SHA=$(git rev-parse HEAD)

echo "Deploying cookbook-backend to Cloud Run..."
echo "Project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Image: ${IMAGE_URL}"
echo "Commit: ${COMMIT_SHA}"
echo ""

gcloud run deploy cookbook-backend \
  --image ${IMAGE_URL} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8000 \
  --timeout 300s \
  --update-env-vars="\
    DJANGO_SETTINGS_MODULE=config.settings,\
    DJANGO_DEBUG=False,\
    DJANGO_ENVIRONMENT=cloud-run,\
    PYTHONUNBUFFERED=True,\
    FRONTEND_ORIGIN=${FRONTEND_URL},\
    DATABASE_URL=${DATABASE_URL}\
  " \
  --labels="commit_sha=${COMMIT_SHA},deployment_time=$(date +%s)"

echo ""
echo "Backend deployment completed. Check Cloud Run logs for details."
