#!/bin/bash
set -e

echo "🔐 S.T.A.R.S. Secret Setup"
echo "=========================="

PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
  echo "❌ No project set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

# Generate secrets
DB_PASSWORD=$(openssl rand -base64 24)
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

echo "📦 Creating secrets in project: $PROJECT_ID"

# Create secrets
echo -n "$DB_PASSWORD" | gcloud secrets create db-password --data-file=- --replication-policy="automatic" 2>/dev/null || gcloud secrets versions add db-password --data-file=<(echo -n "$DB_PASSWORD")
echo -n "$JWT_SECRET" | gcloud secrets create jwt-secret --data-file=- --replication-policy="automatic" 2>/dev/null || gcloud secrets versions add jwt-secret --data-file=<(echo -n "$JWT_SECRET")
echo -n "$REFRESH_SECRET" | gcloud secrets create jwt-refresh-secret --data-file=- --replication-policy="automatic" 2>/dev/null || gcloud secrets versions add jwt-refresh-secret --data-file=<(echo -n "$REFRESH_SECRET")
echo -n "$ENCRYPTION_KEY" | gcloud secrets create encryption-key --data-file=- --replication-policy="automatic" 2>/dev/null || gcloud secrets versions add encryption-key --data-file=<(echo -n "$ENCRYPTION_KEY")

echo "✅ Secrets created!"
echo ""
echo "Save these (you won't see them again):"
echo "   DB_PASSWORD: ${DB_PASSWORD:0:10}..."
echo "   JWT_SECRET: ${JWT_SECRET:0:10}..."
echo ""
echo "Next: Create Cloud SQL instance, then run ./deploy.sh"
