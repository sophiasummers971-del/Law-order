import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'

// Mock data - replace with API calls
const mockCases = [
  {
    id: '1',
    title: 'SHPO Challenge - Operation Dewey',
    status: 'complete',
    progress: 100,
    agentsDeployed: 8,
    priority: 'high',
    updatedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Article 8 Proportionality - Hanna Appeal',
    status: 'researching',
    progress: 65,
    agentsDeployed: 6,
    priority: 'urgent',
    updatedAt: '15 minutes ago',
  },
  {
    id: '3',
    title: 'PACE Compliance Review - Operation Samuel',
    status: 'cross_checking',
    progress: 85,
    agentsDeployed: 8,
    priority: 'normal',
    updatedAt: '1 hour ago',
  },
]

const stats = [
  { label: 'totalCases', value: 12, color: 'text-blue-400' },
  { label: 'activeResearch', value: 3, color: 'text-amber-400' },
  { label: 'completed', value: 8, color: 'text-emerald-400' },
  { label: 'highPriority', value: 2, color: 'text-red-400' },
]

export function DashboardPage() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'researching': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'cross_checking': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'synthesizing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusText = (status: string) => {
    return t(`caseDetail.status.${status}`) || status
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10'
      case 'high': return 'text-amber-400 bg-amber-500/10'
      case 'normal': return 'text-blue-400 bg-blue-500/10'
      default: return 'text-slate-400 bg-slate-500/10'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{t('dashboard.title')}</h1>
        <p className="text-slate-400 mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <p className="text-3xl font-black {stat.color}">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{t(`dashboard.${stat.label}`)}</p>
          </div>
        ))}
      </div>

      {/* Recent Operations */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200">{t('dashboard.recentCases')}</h2>
          <button
            onClick={() => navigate('/new-case')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg text-sm transition-colors"
          >
            + {t('dashboard.createCase')}
          </button>
        </div>

        {mockCases.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-slate-300">{t('dashboard.noCases')}</h3>
            <p className="text-slate-500 mt-2">{t('dashboard.noCasesDesc')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {mockCases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => navigate(`/cases/${caseItem.id}`)}
                className="px-6 py-4 hover:bg-slate-700/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-slate-200 font-medium group-hover:text-amber-400 transition-colors truncate">
                        {caseItem.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                        {t(`common.${caseItem.priority}`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className={`px-2 py-0.5 rounded border text-xs ${getStatusColor(caseItem.status)}`}>
                        {getStatusText(caseItem.status)}
                      </span>
                      <span>{caseItem.agentsDeployed} {t('dashboard.agentsDeployed')}</span>
                      <span>{caseItem.updatedAt}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${caseItem.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400 w-10 text-right">{caseItem.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
