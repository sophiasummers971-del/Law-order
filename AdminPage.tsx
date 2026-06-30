import React from 'react'
import { useI18n } from '../i18n/I18nContext'

const mockStats = {
  totalOperations: 156,
  activeResearch: 12,
  completed: 134,
  failed: 3,
  queued: 7,
}

const mockAgentStatus = [
  { agent: 'statute_hunter', active: 3, queued: 1, failed: 0 },
  { agent: 'case_law_miner', active: 2, queued: 2, failed: 0 },
  { agent: 'defence_architect', active: 4, queued: 0, failed: 1 },
  { agent: 'precedent_matcher', active: 1, queued: 1, failed: 0 },
  { agent: 'jurisdiction_scout', active: 0, queued: 2, failed: 0 },
  { agent: 'procedural_checker', active: 2, queued: 0, failed: 0 },
  { agent: 'sentencing_advisor', active: 0, queued: 1, failed: 0 },
  { agent: 'appeal_strategist', active: 0, queued: 0, failed: 2 },
]

const mockAuditLog = [
  { id: 1, action: 'Operation launched', user: 'operator@stars.ai', timestamp: '2024-01-15 14:32:01', ip: '192.168.1.45' },
  { id: 2, action: 'Agent completed: Statute Hunter', user: 'system', timestamp: '2024-01-15 14:35:22', ip: 'internal' },
  { id: 3, action: 'Brief exported to PDF', user: 'operator@stars.ai', timestamp: '2024-01-15 14:40:15', ip: '192.168.1.45' },
  { id: 4, action: 'Login successful', user: 'admin@lexcore.ai', timestamp: '2024-01-15 15:01:33', ip: '10.0.0.12' },
  { id: 5, action: 'Settings updated: language', user: 'operator@stars.ai', timestamp: '2024-01-15 15:05:47', ip: '192.168.1.45' },
]

export function AdminPage() {
  const { t } = useI18n()

  const statusColors: Record<string, string> = {
    active: 'bg-amber-500',
    queued: 'bg-blue-500',
    failed: 'bg-red-500',
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{t('admin.title')}</h1>
        <p className="text-emerald-400 mt-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {t('admin.systemOperational')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(mockStats).map(([key, value]) => (
          <div key={key} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <p className="text-2xl font-black text-slate-100">{value}</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>
        ))}
      </div>

      {/* Agent Deployment Status */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">{t('admin.agentTaskStatus')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-400">
                <th className="pb-3 pr-4">Agent</th>
                <th className="pb-3 pr-4">Active</th>
                <th className="pb-3 pr-4">Queued</th>
                <th className="pb-3 pr-4">Failed</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {mockAgentStatus.map((item) => (
                <tr key={item.agent} className="hover:bg-slate-700/20">
                  <td className="py-3 pr-4 text-slate-200">{t(`agents.${item.agent}`)}</td>
                  <td className="py-3 pr-4 text-amber-400 font-medium">{item.active}</td>
                  <td className="py-3 pr-4 text-blue-400 font-medium">{item.queued}</td>
                  <td className="py-3 pr-4 text-red-400 font-medium">{item.failed}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      {item.active > 0 && <div className={`w-3 h-3 rounded-full ${statusColors.active}`} title="Active" />}
                      {item.queued > 0 && <div className={`w-3 h-3 rounded-full ${statusColors.queued}`} title="Queued" />}
                      {item.failed > 0 && <div className={`w-3 h-3 rounded-full ${statusColors.failed}`} title="Failed" />}
                      {item.active === 0 && item.queued === 0 && item.failed === 0 && (
                        <span className="text-xs text-slate-500">Idle</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">{t('admin.auditLog')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-400">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {mockAuditLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/20">
                  <td className="px-6 py-3 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                  <td className="px-6 py-3 text-slate-200">{log.action}</td>
                  <td className="px-6 py-3 text-slate-400">{log.user}</td>
                  <td className="px-6 py-3 text-slate-500 font-mono text-xs">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
