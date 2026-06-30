#!/bin/bash
set -e

echo "🚀 S.T.A.R.S. Google Cloud Deploy Script"
echo "========================================"

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="europe-west2"
BACKEND_IMAGE="gcr.io/${PROJECT_ID}/stars-backend"

if [ -z "$PROJECT_ID" ]; then
  echo "❌ No project set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "📦 Project: $PROJECT_ID"
echo "🌍 Region: $REGION"

# Step 1: Build and push backend image
echo ""
echo "📦 Step 1: Building backend Docker image..."
gcloud builds submit --tag ${BACKEND_IMAGE} ./backend

# Step 2: Get secrets
echo ""
echo "🔐 Step 2: Fetching secrets..."
DB_PASSWORD=$(gcloud secrets versions access latest --secret=db-password 2>/dev/null || echo "")
JWT_SECRET=$(gcloud secrets versions access latest --secret=jwt-secret 2>/dev/null || echo "")
REFRESH_SECRET=$(gcloud secrets versions access latest --secret=jwt-refresh-secret 2>/dev/null || echo "")
ENCRYPTION_KEY=$(gcloud secrets versions access latest --secret=encryption-key 2>/dev/null || echo "")

if [ -z "$DB_PASSWORD" ]; then
  echo "⚠️  Secrets not found. Create them first with:"
  echo "   ./setup-secrets.sh"
  exit 1
fi

# Step 3: Deploy to Cloud Run
echo ""
echo "☁️  Step 3: Deploying to Cloud Run..."

CLOUD_SQL_CONN=$(gcloud sql instances describe stars-postgres --format='value(connectionName)' 2>/dev/null || echo "")

if [ -z "$CLOUD_SQL_CONN" ]; then
  echo "⚠️  Cloud SQL instance not found. Create it first with:"
  echo "   gcloud sql instances create stars-postgres --database-version=POSTGRES_16 --tier=db-f1-micro --region=${REGION}"
  exit 1
fi

gcloud run deploy stars-backend \
  --image ${BACKEND_IMAGE} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-env-vars="PORT=3001" \
  --set-env-vars="CLOUD_SQL_CONNECTION_NAME=${CLOUD_SQL_CONN}" \
  --set-env-vars="DB_USER=postgres" \
  --set-env-vars="DB_NAME=stars_db" \
  --set-env-vars="DB_PASSWORD=${DB_PASSWORD}" \
  --set-env-vars="JWT_SECRET=${JWT_SECRET}" \
  --set-env-vars="JWT_REFRESH_SECRET=${REFRESH_SECRET}" \
  --set-env-vars="ENCRYPTION_KEY=${ENCRYPTION_KEY}" \
  --set-env-vars="JWT_EXPIRES_IN=15m" \
  --set-env-vars="JWT_REFRESH_EXPIRES_IN=7d" \
  --set-env-vars="FRONTEND_URL=https://your-firebase-url.web.app" \
  --set-env-vars="RATE_LIMIT_MAX=100" \
  --set-cloudsql-instances=${CLOUD_SQL_CONN} \
  --memory=1Gi \
  --cpu=1 \
  --concurrency=80 \
  --max-instances=10 \
  --min-instances=1

# Step 4: Get backend URL
echo ""
echo "🔗 Step 4: Getting backend URL..."
BACKEND_URL=$(gcloud run services describe stars-backend --region=${REGION} --format='value(status.url)')
echo "   Backend URL: ${BACKEND_URL}"

# Step 5: Update frontend API URL
echo ""
echo "📝 Step 5: Updating frontend API config..."
sed -i "s|http://localhost:3001|${BACKEND_URL}/api|g" ./frontend/src/utils/api.ts 2>/dev/null || true

echo ""
echo "✅ Backend deployed successfully!"
echo ""
echo "Next steps:"
echo "   1. Deploy frontend: cd frontend && firebase deploy"
echo "   2. Update FRONTEND_URL in Cloud Run with your Firebase URL"
echo "   3. Run migrations: ./run-migrations.sh"
