const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('stars_token')

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    localStorage.removeItem('stars_token')
    window.location.href = '/login'
    return
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  return res.json()
}

export function setToken(token: string) {
  localStorage.setItem('stars_token', token)
}

export function getToken(): string | null {
  return localStorage.getItem('stars_token')
}

export function clearToken() {
  localStorage.removeItem('stars_token')
  localStorage.removeItem('stars_refresh_token')
}
