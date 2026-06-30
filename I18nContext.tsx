import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations, Language, rtlLanguages, languageNames, languageFlags } from './translations'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
  availableLanguages: Language[]
  languageNames: Record<Language, string>
  languageFlags: Record<Language, string>
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'stars_language'

function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    current = current[key]
  }
  return typeof current === 'string' ? current : undefined
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    return stored && translations[stored as Language] ? stored : 'en'
  })

  const isRTL = rtlLanguages.includes(language)

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [])

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, isRTL])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const currentTranslations = translations[language] as any
      let value = getNestedValue(currentTranslations, key)

      // Fallback to English if translation missing
      if (value === undefined && language !== 'en') {
        const englishTranslations = translations['en'] as any
        value = getNestedValue(englishTranslations, key)
      }

      if (value === undefined) {
        console.warn(`[i18n] Missing translation key: ${key}`)
        return key
      }

      // Replace params
      if (params) {
        return Object.entries(params).reduce((acc, [k, v]) => {
          return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v))
        }, value)
      }

      return value
    },
    [language]
  )

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        availableLanguages: Object.keys(translations) as Language[],
        languageNames,
        languageFlags,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
