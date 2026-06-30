import React from 'react'
import { useI18n } from '../i18n/I18nContext'

export function ProfilePage() {
  const { t } = useI18n()

  const user = {
    name: 'Operator Alpha',
    email: 'operator@stars.ai',
    role: 'Senior Counsel',
    organisation: 'Angel Investigations',
    location: 'London, UK',
    phone: '+44 20 7946 0958',
    barNumber: 'SRA-78432-London',
    memberSince: '2024-01-10',
    lastLogin: '2024-01-15 14:30:00',
    status: 'Active',
  }

  const recentActivity = [
    { action: 'Launched Operation Dewey', time: '2 hours ago', type: 'case' },
    { action: 'Exported briefing to PDF', time: '3 hours ago', type: 'export' },
    { action: 'Updated security settings', time: '1 day ago', type: 'settings' },
    { action: 'Completed Operation Hanna', time: '2 days ago', type: 'case' },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{t('profile.title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-3xl font-black text-slate-900 mb-4">
              OA
            </div>
            <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
            <p className="text-amber-400 text-sm mt-1">{user.role}</p>
            <p className="text-slate-500 text-sm">{user.organisation}</p>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500">{t('profile.memberSince')}</p>
              <p className="text-sm text-slate-300">{user.memberSince}</p>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-500">{t('profile.lastLogin')}</p>
              <p className="text-sm text-slate-300">{user.lastLogin}</p>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                ● {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">{t('profile.professionalInfo')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">{t('profile.role')}</p>
                <p className="text-slate-200">{user.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('profile.organisation')}</p>
                <p className="text-slate-200">{user.organisation}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('profile.location')}</p>
                <p className="text-slate-200">{user.location}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">{t('profile.phone')}</p>
                <p className="text-slate-200">{user.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">{t('profile.barNumber')}</p>
                <p className="text-slate-200 font-mono">{user.barNumber}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">{t('profile.recentActivity')}</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {activity.type === 'case' ? '🎯' : activity.type === 'export' ? '📄' : '⚙️'}
                    </span>
                    <span className="text-slate-300 text-sm">{activity.action}</span>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition-colors">
            {t('profile.editProfile')}
          </button>
        </div>
      </div>
    </div>
  )
}
