-- S.T.A.R.S. Database Schema
-- PostgreSQL with Row-Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'lawyer', 'admin')),
  organisation VARCHAR(255),
  bar_number VARCHAR(100),
  location VARCHAR(255),
  phone VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',
  dark_mode BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  account_locked BOOLEAN DEFAULT false,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cases/Operations table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  offence_type VARCHAR(100),
  jurisdiction VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'researching', 'cross_checking', 'synthesizing', 'complete', 'error')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  facts TEXT,
  brief TEXT,
  confidence_score INTEGER,
  win_probability INTEGER,
  encrypted_at_rest BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Agent tasks table
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN (
    'statute_hunter', 'case_law_miner', 'defence_architect', 'precedent_matcher',
    'jurisdiction_scout', 'procedural_checker', 'sentencing_advisor', 'appeal_strategist',
    'closing_argument_architect', 'funding_advisor'
  )),
  status VARCHAR(50) DEFAULT 'waiting' CHECK (status IN ('waiting', 'researching', 'complete', 'failed')),
  progress INTEGER DEFAULT 0,
  findings TEXT,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table (encrypted file references)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  original_name VARCHAR(500) NOT NULL,
  storage_path VARCHAR(1000) NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  encryption_iv VARCHAR(255),
  checksum VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log (immutable)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address INET,
  user_agent TEXT,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_jurisdiction VARCHAR(100),
  default_priority VARCHAR(20) DEFAULT 'normal',
  data_retention_days INTEGER DEFAULT 365,
  email_notifications BOOLEAN DEFAULT true,
  case_alerts BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users: users can only see their own data, admins can see all
CREATE POLICY users_self ON users FOR ALL USING (
  id = current_setting('app.current_user_id')::UUID OR 
  current_setting('app.current_user_role') = 'admin'
);

-- Cases: users can only see their own cases
CREATE POLICY cases_self ON cases FOR ALL USING (
  user_id = current_setting('app.current_user_id')::UUID OR 
  current_setting('app.current_user_role') = 'admin'
);

-- Agent tasks: linked to cases user owns
CREATE POLICY agent_tasks_case ON agent_tasks FOR ALL USING (
  case_id IN (SELECT id FROM cases WHERE user_id = current_setting('app.current_user_id')::UUID) OR 
  current_setting('app.current_user_role') = 'admin'
);

-- Documents: linked to cases user owns
CREATE POLICY documents_case ON documents FOR ALL USING (
  case_id IN (SELECT id FROM cases WHERE user_id = current_setting('app.current_user_id')::UUID) OR 
  current_setting('app.current_user_role') = 'admin'
);

-- Sessions: users can only see their own sessions
CREATE POLICY sessions_self ON sessions FOR ALL USING (
  user_id = current_setting('app.current_user_id')::UUID
);

-- User settings: users can only see their own settings
CREATE POLICY user_settings_self ON user_settings FOR ALL USING (
  user_id = current_setting('app.current_user_id')::UUID
);

-- Audit log: append-only, readable by admins
CREATE POLICY audit_log_read ON audit_log FOR SELECT USING (
  current_setting('app.current_user_role') = 'admin'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_case_id ON agent_tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_case_id ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
