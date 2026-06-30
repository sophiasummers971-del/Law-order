#!/bin/bash
set -e

echo "🔄 Running database migrations..."

PROJECT_ID=$(gcloud config get-value project)
REGION="europe-west2"

# Run migrations using Cloud Run job
gcloud run jobs create stars-migrate \
  --image gcr.io/${PROJECT_ID}/stars-backend \
  --region ${REGION} \
  --command npm \
  --args run,db:migrate \
  --set-cloudsql-instances=$(gcloud sql instances describe stars-postgres --format='value(connectionName)') \
  --set-env-vars="DATABASE_URL=postgresql://postgres:$(gcloud secrets versions access latest --secret=db-password)@/stars_db?host=/cloudsql/$(gcloud sql instances describe stars-postgres --format='value(connectionName)')" \
  --max-retries=1 \
  2>/dev/null || true

gcloud run jobs execute stars-migrate --region ${REGION}

echo "✅ Migrations complete!"
