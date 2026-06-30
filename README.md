# S.T.A.R.S. — Multi-Agent AI Legal Research Engine

> **Special Tactics and Rescue Services**  
> AI-powered legal research platform deploying 8 specialist agents in parallel to research, cross-check, and synthesize comprehensive legal briefs.

---

## 🚀 What is S.T.A.R.S.?

S.T.A.R.S. is a production-grade legal research platform that cuts days of legal research into minutes. It deploys 8 specialist AI agents in parallel — not a chatbot, but a back-office research powerhouse.

### The 8 Agents

| Agent | Role |
|-------|------|
| **Statute Hunter** | Finds all relevant UK/EU statutes & regulations |
| **Case Law Miner** | Digs up binding precedents & appellate decisions |
| **Defence Architect** | Maps every possible defence line & strategic angle |
| **Precedent Matcher** | Matches fact patterns & predicts outcomes |
| **Jurisdiction Scout** | Checks Scottish, EU & Commonwealth angles |
| **Procedural Checker** | Flags PACE errors, disclosure issues, time limits |
| **Sentencing Advisor** | Analyzes guidelines & penalty ranges |
| **Appeal Strategist** | Develops appeal grounds & assesses prospects |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18 + Vite)                 │
│  Dashboard │ New Case │ Brief │ Admin │ Settings │ Profile     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                 │
│  Auth (JWT) │ Case API │ Agent Orchestrator │ Admin API      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL + Row-Level Security                │
│         AES-256-GCM │ Immutable Audit Log │ RLS             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Docker (optional)

### 1. Clone & Setup

```bash
git clone <repo-url>
cd lexcore-i18n
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### 4. Docker (One-Command)

```bash
docker-compose up -d
```

---

## 🌍 Deployment

### Google Cloud (Cloud Run + Cloud SQL)

```bash
# 1. Setup secrets
./setup-secrets.sh

# 2. Deploy everything
./deploy.sh
```

### Netlify (Frontend Only)

```bash
cd frontend
echo "VITE_API_URL=https://your-backend-url/api" > .env
npm run build
# Drag `dist/` folder to Netlify or use CLI
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/cases` | Start new research |
| GET | `/api/cases` | List operations |
| GET | `/api/cases/:id` | Get case details |
| GET | `/api/cases/:id/status` | Real-time status |
| GET | `/api/admin/stats` | System stats |
| GET | `/api/admin/audit-log` | Audit trail |

---

## 🔐 Security

- **AES-256-GCM** encryption for all case data
- **Row-Level Security** (RLS) in PostgreSQL
- **JWT** with refresh tokens + bcrypt hashing
- **Rate limiting** (100 req/15min)
- **Helmet** headers (CSP, HSTS, XSS)
- **Account lockout** after 5 failed logins
- **Immutable audit log** tracking all actions

---

## 🌐 Internationalization

| Language | Status | Code |
|----------|--------|------|
| English | ✅ Complete | `en` |
| Dutch | ✅ Complete | `nl` |
| German | 🟡 Placeholder | `de` |
| French | 🟡 Placeholder | `fr` |
| Spanish | 🟡 Placeholder | `es` |
| + 10 more | 🟡 Placeholder | — |

RTL support for Arabic (`ar`) and Urdu (`ur`).

---

## 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@lexcore.ai` | `admin123` |
| Lawyer | `lawyer@lexcore.ai` | `lawyer123` |
| User | `user@lexcore.ai` | `user123` |

---

## 📄 License

MIT License — See [LICENSE](LICENSE) file for details.

---

Built with 💙 for the legal profession.  
**S.T.A.R.S.** — *Justice is not a luxury.*
