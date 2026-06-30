import React from 'react'
import { useI18n } from '../i18n/I18nContext'
import { Language } from '../i18n/translations'

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, languageNames, languageFlags, availableLanguages } = useI18n()

  if (compact) {
    return (
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        aria-label="Select language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageFlags[lang]} {languageNames[lang]}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        🌐 Language / Taal / Sprache
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
              language === lang
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 ring-1 ring-amber-500'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="text-2xl mb-1">{languageFlags[lang]}</span>
            <span className="text-xs font-medium">{languageNames[lang]}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {language === 'en' && 'More languages coming soon. Contributions welcome!'}
        {language === 'nl' && 'Meer talen binnenkort beschikbaar. Bijdragen welkom!'}
        {language !== 'en' && language !== 'nl' && 'More languages coming soon. Contributions welcome!'}
      </p>
    </div>
  )
}
