import { en } from './en'
import { nl } from './nl'
import { de } from './de'
import { fr } from './fr'
import { es } from './es'
import { pl } from './pl'
import { ro } from './ro'
import { it } from './it'
import { pt } from './pt'
import { tr } from './tr'
import { ar } from './ar'
import { ur } from './ur'
import { hi } from './hi'
import { zh } from './zh'
import { bn } from './bn'

export type Language = 'en' | 'nl' | 'de' | 'fr' | 'es' | 'pl' | 'ro' | 'it' | 'pt' | 'tr' | 'ar' | 'ur' | 'hi' | 'zh' | 'bn'

export const translations = {
  en, nl, de, fr, es, pl, ro, it, pt, tr, ar, ur, hi, zh, bn
} as const

export type Translations = typeof translations
export type TranslationKey = keyof typeof en

export const rtlLanguages: Language[] = ['ar', 'ur']

export const languageNames: Record<Language, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pl: 'Polski',
  ro: 'Română',
  it: 'Italiano',
  pt: 'Português',
  tr: 'Türkçe',
  ar: 'العربية',
  ur: 'اردو',
  hi: 'हिन्दी',
  zh: '中文',
  bn: 'বাংলা',
}

export const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  pl: '🇵🇱',
  ro: '🇷🇴',
  it: '🇮🇹',
  pt: '🇵🇹',
  tr: '🇹🇷',
  ar: '🇸🇦',
  ur: '🇵🇰',
  hi: '🇮🇳',
  zh: '🇨🇳',
  bn: '🇧🇩',
}
