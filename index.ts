export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'user' | 'lawyer' | 'admin'
  organisation: string | null
  barNumber: string | null
  location: string | null
  phone: string | null
  language: string
  darkMode: boolean
  twoFactorEnabled: boolean
  emailVerified: boolean
  accountLocked: boolean
  lastLoginAt: Date | null
  createdAt: Date
}

export interface Case {
  id: string
  userId: string
  title: string
  description: string | null
  offenceType: string | null
  jurisdiction: string | null
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'researching' | 'cross_checking' | 'synthesizing' | 'complete' | 'error'
  progress: number
  facts: string | null
  brief: string | null
  confidenceScore: number | null
  winProbability: number | null
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}

export interface AgentTask {
  id: string
  caseId: string
  agentType: string
  status: 'waiting' | 'researching' | 'complete' | 'failed'
  progress: number
  findings: string | null
  confidence: number | null
  startedAt: Date | null
  completedAt: Date | null
  errorMessage: string | null
}

export interface Document {
  id: string
  caseId: string
  originalName: string
  storagePath: string
  fileSize: number | null
  mimeType: string | null
  uploadedAt: Date
}

export interface AuditLogEntry {
  id: string
  userId: string | null
  action: string
  resourceType: string | null
  resourceId: string | null
  details: Record<string, any> | null
  ipAddress: string | null
  userAgent: string | null
  timestamp: Date
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}
