import type { Credentials } from '@/shared/api/green-api'

// sessionStorage, а не localStorage: токен живёт только до закрытия вкладки
const CREDS_KEY = 'green-api-credentials'

export function loadCredentials(): Credentials | null {
  try {
    const raw = sessionStorage.getItem(CREDS_KEY)
    return raw ? (JSON.parse(raw) as Credentials) : null
  } catch {
    return null
  }
}

export function saveCredentials(creds: Credentials) {
  sessionStorage.setItem(CREDS_KEY, JSON.stringify(creds))
}

export function clearCredentials() {
  sessionStorage.removeItem(CREDS_KEY)
}
