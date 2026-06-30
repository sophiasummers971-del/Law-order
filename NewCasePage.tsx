import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'

export function NewCasePage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [facts, setFacts] = useState('')
  const [offenceType, setOffenceType] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [priority, setPriority] = useState('normal')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const offenceTypes = [
    'Sexual Offences (SHPO/SRO)',
    'Violent Crime',
    'Fraud & Financial Crime',
    'Drug Offences',
    'Driving Offences',
    'Public Order',
    'Terrorism',
    'Other',
  ]

  const jurisdictions = [
    'England & Wales',
    'Scotland',
    'Northern Ireland',
    'EU Law',
    'Commonwealth',
  ]

  const priorities = [
    { value: 'low', label: t('common.low') },
    { value: 'normal', label: t('common.normal') },
    { value: 'high', label: t('common.high') },
    { value: 'urgent', label: t('common.urgent') },
  ]

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped].slice(0, 10))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selected].slice(0, 10))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      navigate('/cases/1')
    }, 2000)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{t('newCase.title')}</h1>
        <p className="text-slate-400 mt-1">{t('newCase.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Operation Title */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {t('newCase.caseTitle')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('newCase.caseTitlePlaceholder')}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Mission Brief & Intelligence */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {t('newCase.caseFacts')}
          </label>
          <p className="text-xs text-slate-500 mb-2">{t('newCase.caseFactsHint')}</p>
          <textarea
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            placeholder={t('newCase.caseFactsPlaceholder')}
            rows={8}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            required
            minLength={10}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-3 px-1">
            <span className="text-slate-400">{facts.length} {t('newCase.characters')}</span>
            <span className={facts.length < 10 ? 'text-red-400 font-medium' : 'text-slate-500'}>
              {facts.length < 10 && '⚠️ '}{t('newCase.minChars')}
            </span>
          </div>
        </div>

        {/* Classification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('newCase.offenceType')}
            </label>
            <select
              value={offenceType}
              onChange={(e) => setOffenceType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Select classification...</option>
              {offenceTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('newCase.jurisdiction')}
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Select theatre...</option>
              {jurisdictions.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('newCase.priority')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    priority === p.value
                      ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/25'
                      : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Documents */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {t('newCase.documents')}
          </label>
          <p className="text-xs text-slate-500 mb-4">{t('newCase.documentsHint')}</p>

          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer"
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.docx,.txt"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-slate-300 font-medium">{t('newCase.dragDrop')}</p>
              <p className="text-sm text-slate-500 mt-1">{t('newCase.fileTypes')}</p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-900/50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-slate-300 truncate">📄 {file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">🔒 {t('newCase.encryptionNote')}</p>
          <button
            type="submit"
            disabled={loading || facts.length < 10}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-900 font-bold rounded-lg transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('newCase.launching')}
              </>
            ) : (
              <>
                🚀 {t('newCase.launchResearch')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
