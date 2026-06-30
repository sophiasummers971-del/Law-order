import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'

interface AgentStatus {
  id: string
  name: string
  status: 'waiting' | 'researching' | 'complete' | 'failed'
  progress: number
  findings: string
}

const mockAgents: AgentStatus[] = [
  { id: 'statute_hunter', name: 'Statute Hunter', status: 'complete', progress: 100, findings: 'SOA 2003 s.103, HRA 1998 Art.8' },
  { id: 'case_law_miner', name: 'Case Law Miner', status: 'complete', progress: 100, findings: 'Dewey 2024, Hanna 2023, Parsons 2017' },
  { id: 'defence_architect', name: 'Defence Architect', status: 'researching', progress: 75, findings: 'Article 8 proportionality, necessity defence' },
  { id: 'precedent_matcher', name: 'Precedent Matcher', status: 'complete', progress: 100, findings: '3 matching precedents found' },
  { id: 'jurisdiction_scout', name: 'Jurisdiction Scout', status: 'researching', progress: 60, findings: 'Scottish Act 2016 relevant' },
  { id: 'procedural_checker', name: 'Procedural Checker', status: 'complete', progress: 100, findings: 'PACE s.58 compliance verified' },
  { id: 'sentencing_advisor', name: 'Sentencing Advisor', status: 'waiting', progress: 0, findings: '' },
  { id: 'appeal_strategist', name: 'Appeal Strategist', status: 'waiting', progress: 0, findings: '' },
]

export function CaseDetailPage() {
  const { t } = useI18n()
  const { id } = useParams()
  const navigate = useNavigate()
  const [agents, setAgents] = useState<AgentStatus[]>(mockAgents)
  const [overallProgress, setOverallProgress] = useState(65)
  const [elapsed, setElapsed] = useState('00:04:32')
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.status === 'researching') {
            const newProgress = Math.min(agent.progress + 5, 100)
            return {
              ...agent,
              progress: newProgress,
              status: newProgress >= 100 ? 'complete' : 'researching',
            }
          }
          if (agent.status === 'waiting' && Math.random() > 0.7) {
            return { ...agent, status: 'researching', progress: 10 }
          }
          return agent
        })
      )
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const completed = agents.filter((a) => a.status === 'complete').length
    const newProgress = Math.round((completed / agents.length) * 100)
    setOverallProgress(newProgress)
    if (newProgress === 100) {
      setTimeout(() => setShowComplete(true), 1000)
    }
  }, [agents])

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'researching': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getAgentStatusText = (status: string) => {
    return t(`agents.${status}`) || status
  }

  if (showComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-12">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">{t('caseDetail.researchComplete')}</h1>
          <p className="text-slate-400 mb-6">{t('caseDetail.redirecting')}</p>
          <button
            onClick={() => navigate(`/cases/${id}/brief`)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition-colors"
          >
            {t('caseDetail.viewNow')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">SHPO Challenge - Operation Dewey</h1>
        <p className="text-slate-400 mt-1">Operation ID: {id}</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">{t('caseDetail.overallProgress')}</h2>
          <div className="text-right">
            <p className="text-2xl font-black text-amber-400">{overallProgress}%</p>
            <p className="text-xs text-slate-500">{t('caseDetail.elapsed')}: {elapsed}</p>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Agent Activity Log */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">{t('caseDetail.agentActivityLog')}</h2>
        </div>
        <div className="divide-y divide-slate-700/50">
          {agents.map((agent) => (
            <div key={agent.id} className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {agent.status === 'complete' ? '✅' : agent.status === 'researching' ? '🔍' : '⏳'}
                  </span>
                  <div>
                    <p className="text-slate-200 font-medium">{t(`agents.${agent.id}`)}</p>
                    <p className="text-xs text-slate-500">{agent.findings || 'Awaiting intelligence...'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded border text-xs font-medium ${getAgentStatusColor(agent.status)}`}>
                  {getAgentStatusText(agent.status)}
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    agent.status === 'complete' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
