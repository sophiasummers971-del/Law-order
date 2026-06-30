import React from 'react'
import { useI18n } from '../i18n/I18nContext'

const fundingOptions = [
  {
    name: 'Legal Aid (Criminal)',
    pros: ['Free representation', 'Choice of solicitor', 'Covers all hearings'],
    cons: ['Means test required', 'Merits test for some cases', 'Limited choice in some areas'],
    eligibility: 'Pass means test + case has merit',
    howToApply: 'Apply through a solicitor immediately. Do not delay.',
    estimatedCost: '£0 (if eligible)',
    timeline: 'Immediate upon arrest/charge',
    contact: 'Find a solicitor at find-a-solicitor.lawsociety.org.uk',
    website: 'gov.uk/legal-aid',
  },
  {
    name: 'Pro Bono (LawWorks)',
    pros: ['Free for eligible clients', 'Quality-assured lawyers', 'Civil and criminal'],
    cons: ['Limited availability', 'Not all cases covered', 'May not cover full trial'],
    eligibility: 'Low income, meritorious case, no other funding',
    howToApply: 'Complete online application at lawworks.org.uk',
    estimatedCost: '£0',
    timeline: '2-4 weeks assessment',
    contact: '020 7092 3960',
    website: 'lawworks.org.uk',
  },
  {
    name: 'Citizens Advice',
    pros: ['Free advice', 'Local offices', 'Wide range of issues'],
    cons: ['Advice only, not representation', 'Long waiting times', 'Limited capacity'],
    eligibility: 'Open to all',
    howToApply: 'Walk-in or phone your local office',
    estimatedCost: '£0',
    timeline: 'Same day (walk-in) or appointment',
    contact: '0800 144 8848 (England)',
    website: 'citizensadvice.org.uk',
  },
  {
    name: 'Private Fixed Fee',
    pros: ['Predictable costs', 'Choice of solicitor', 'Full representation'],
    cons: ['Upfront payment required', 'May not cover all eventualities', 'Expensive for complex cases'],
    eligibility: 'Anyone who can pay',
    howToApply: 'Contact solicitors for quotes. Shop around.',
    estimatedCost: '£2,000 - £10,000+',
    timeline: 'Immediate upon agreement',
    contact: 'Solicitors in your area',
    website: 'solicitors.lawsociety.org.uk',
  },
  {
    name: 'Crowdfunding',
    pros: ['Community support', 'Can raise significant funds', 'Raises awareness'],
    cons: ['Public exposure', 'No guarantee of funds', 'Platform fees apply'],
    eligibility: 'Strong case with public interest angle',
    howToApply: 'Create campaign on CrowdJustice or GoFundMe',
    estimatedCost: 'Variable (platform fees ~5%)',
    timeline: 'Weeks to months',
    contact: 'crowdjustice.com',
    website: 'crowdjustice.com',
  },
]

export function FundingPage() {
  const { t } = useI18n()

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{t('funding.title')}</h1>
        <p className="text-slate-400 mt-2">{t('funding.subtitle')}</p>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🚨</span>
          <div>
            <h2 className="text-lg font-bold text-red-400 mb-1">{t('funding.important')}</h2>
            <p className="text-slate-300">{t('funding.hiddenCostWarning')}</p>
          </div>
        </div>
      </div>

      {/* Rescue Ladder */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-200 mb-6">{t('funding.fundingStaircase')}</h2>
        <div className="space-y-4">
          {[
            { step: 'step1', stepDesc: 'step1Desc', num: 1 },
            { step: 'step2', stepDesc: 'step2Desc', num: 2 },
            { step: 'step3', stepDesc: 'step3Desc', num: 3 },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                {item.num}
              </div>
              <div>
                <h3 className="text-slate-200 font-medium">{t(`funding.${item.step}`)}</h3>
                <p className="text-slate-400 text-sm">{t(`funding.${item.stepDesc}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Funding Options Grid */}
      <h2 className="text-xl font-semibold text-slate-200 mb-4">{t('funding.fundingOptions')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {fundingOptions.map((option) => (
          <div key={option.name} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-amber-400 mb-3">{option.name}</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('funding.eligibility')}</p>
                <p className="text-slate-300">{option.eligibility}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('funding.estimatedCost')}</p>
                <p className="text-slate-300">{option.estimatedCost}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('funding.timeline')}</p>
                <p className="text-slate-300">{option.timeline}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('funding.contact')}</p>
                <p className="text-slate-300">{option.contact}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('funding.website')}</p>
                <p className="text-blue-400">{option.website}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-emerald-400 font-medium mb-1">{t('funding.pros')}</p>
                  <ul className="text-slate-400 space-y-0.5">
                    {option.pros.map((pro, i) => (
                      <li key={i}>✓ {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-red-400 font-medium mb-1">{t('funding.cons')}</p>
                  <ul className="text-slate-400 space-y-0.5">
                    {option.cons.map((con, i) => (
                      <li key={i}>✗ {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* You Are Not Alone */}
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-amber-400 mb-2">{t('funding.youAreNotAlone')}</h2>
        <p className="text-slate-300">{t('funding.notAloneDesc')}</p>
      </div>
    </div>
  )
}
