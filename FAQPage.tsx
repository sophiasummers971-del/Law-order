import React, { useState } from 'react'
import { useI18n } from '../i18n/I18nContext'

const legislationSummaries = [
  {
    title: 'Sexual Offences Act 2003',
    summary: 'Primary legislation governing sexual offences in England & Wales. Key sections: s.103 (SHPO), s.122 (SRO), notification requirements for registered sex offenders.',
    keySections: ['s.103 - SHPO', 's.122 - SRO', 's.80 - Notification'],
  },
  {
    title: 'Human Rights Act 1998',
    summary: 'Incorporates ECHR into UK law. Article 8 (right to private/family life) is critical for SHPO proportionality challenges. Article 6 (fair trial) applies throughout.',
    keySections: ['Art. 8 - Private Life', 'Art. 6 - Fair Trial', 's.3 - Interpretation'],
  },
  {
    title: 'PACE 1984',
    summary: 'Police and Criminal Evidence Act. Governs arrest, detention, evidence gathering. s.58 (right to legal advice), s.78 (exclusion of unfair evidence).',
    keySections: ['s.58 - Legal Advice', 's.78 - Unfair Evidence', 'Code C - Detention'],
  },
  {
    title: 'Criminal Procedure Rules 2020',
    summary: 'Procedural rules for criminal cases. r.28.7 governs SHPO applications, notice requirements, and contested hearings.',
    keySections: ['r.28.7 - SHPO', 'r.24 - Evidence', 'r.3 - Case Management'],
  },
]

const faqs = [
  {
    question: 'What is a SHPO and how does it work?',
    answer: 'A Sexual Harm Prevention Order (SHPO) is a civil order under SOA 2003 s.103. It can impose restrictions on a person's behaviour to protect the public from sexual harm. Unlike a conviction, it requires only a civil standard of proof (balance of probabilities).',
  },
  {
    question: 'How long does a SHPO last?',
    answer: 'Minimum 5 years. Can be indefinite. Subject to annual review. Can be varied or discharged on application.',
  },
  {
    question: 'What defences are available against a SHPO?',
    answer: '1. Proportionality challenge (Article 8 ECHR)
2. Necessity test - are the restrictions necessary?
3. Procedural challenge - PACE compliance, disclosure
4. Factual challenge - disputed evidence
5. Jurisdictional challenge - wrong court, wrong procedure',
  },
  {
    question: 'Can I appeal a SHPO?',
    answer: 'Yes. Appeal to the Crown Court within 21 days of the order. Grounds include: wrong in law, wrong in fact, disproportionate, procedural irregularity.',
  },
  {
    question: 'What funding is available for legal representation?',
    answer: 'Legal Aid (subject to means/merits test), pro bono schemes (LawWorks, Advocate), fixed-fee private representation, crowdfunding, union legal support.',
  },
]

export function FAQPage() {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  )

  const filteredLegislation = legislationSummaries.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.summary.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{t('faq.title')}</h1>
      </div>

      {/* Search */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('faq.searchPlaceholder')}
            className="w-full px-4 py-3 pl-12 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        </div>
      </div>

      {/* Legislation Summaries */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">{t('faq.legislationSummaries')}</h2>
        {filteredLegislation.length === 0 ? (
          <p className="text-slate-500 text-center py-8">{t('faq.noResults')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLegislation.map((leg) => (
              <div key={leg.title} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">{leg.title}</h3>
                <p className="text-sm text-slate-300 mb-3">{leg.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {leg.keySections.map((section) => (
                    <span key={section} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Frequently Asked Questions</h2>
        {filteredFaqs.length === 0 ? (
          <p className="text-slate-500 text-center py-8">{t('faq.noResults')}</p>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
                >
                  <span className="text-slate-200 font-medium">{faq.question}</span>
                  <span className="text-slate-400 text-xl">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-300 whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
