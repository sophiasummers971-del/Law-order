import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { LanguageSelector } from '../components/LanguageSelector'

export function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Demo credentials check
      if ((email === 'admin@lexcore.ai' && password === 'admin123') ||
          (email === 'lawyer@lexcore.ai' && password === 'lawyer123')) {
        localStorage.setItem('stars_token', 'demo_jwt_token')
        navigate('/dashboard')
      } else {
        setError(t('login.error'))
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 mb-4 shadow-lg shadow-amber-500/20">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">S</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            {t('login.title')}
          </h1>
          <p className="text-amber-500/80 font-medium mt-1">{t('login.subtitle')}</p>
          <p className="text-slate-500 text-sm mt-2">{t('app.tagline')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="operator@stars.ai"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('login.signingIn')}
                </>
              ) : (
                t('login.signIn')
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              {t('login.demoCredentials')}
            </p>
            <div className="space-y-1 text-sm text-slate-500">
              <p>Admin: <span className="text-slate-300">admin@lexcore.ai / admin123</span></p>
              <p>Lawyer: <span className="text-slate-300">lawyer@lexcore.ai / lawyer123</span></p>
            </div>
          </div>

          {/* Security Note */}
          <p className="text-center text-xs text-slate-600 mt-4">
            🔒 {t('login.securityNote')}
          </p>
        </div>

        {/* Language Selector */}
        <div className="mt-6 flex justify-center">
          <LanguageSelector compact />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          {t('app.poweredBy')} • {t('app.featuredBy')}
        </p>
      </div>
    </div>
  )
}
