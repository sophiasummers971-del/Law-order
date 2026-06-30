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
    clearToken()
    window.location.href = '/login'
    return
  }

  const text = await res.text()
  let data: any = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { error: text }
  }

  if (!res.ok) {
    throw new Error(data.error || "HTTP " + res.status)
  }

  return data
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
