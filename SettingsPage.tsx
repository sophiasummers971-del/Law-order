import React, { useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { LanguageSelector } from '../components/LanguageSelector'

export function SettingsPage() {
  const { t } = useI18n()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">{t('settings.title')}</h1>
      <p className="text-slate-400 mb-8">S.T.A.R.S. {t('app.version')}</p>

      <div className="space-y-6">
        {/* Language Section */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            🌐 {t('settings.preferences')}
          </h2>
          <LanguageSelector />
        </section>

        {/* Appearance Section */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">{t('settings.preferences')}</h2>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-slate-200 font-medium">{t('settings.darkMode')}</p>
              <p className="text-sm text-slate-500">{t('settings.darkModeDesc')}</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-amber-500 transition-transform" />
            </button>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">{t('settings.security')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
              <div>
                <p className="text-slate-200 font-medium">{t('settings.twoFactor')}</p>
                <p className="text-sm text-slate-500">{t('settings.twoFactorDesc')}</p>
              </div>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors">
                {t('common.configure')}
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            {saved ? '✓ ' + t('common.saved') : t('settings.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  )
}
