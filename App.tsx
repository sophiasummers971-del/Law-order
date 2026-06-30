import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nProvider } from './i18n/I18nContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewCasePage } from './pages/NewCasePage'
import { CaseDetailPage } from './pages/CaseDetailPage'
import { BriefPage } from './pages/BriefPage'
import { AdminPage } from './pages/AdminPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { FAQPage } from './pages/FAQPage'
import { FundingPage } from './pages/FundingPage'
import './index.css'

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/new-case" element={<NewCasePage />} />
              <Route path="/cases/:id" element={<CaseDetailPage />} />
              <Route path="/cases/:id/brief" element={<BriefPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/funding" element={<FundingPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App
