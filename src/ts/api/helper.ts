import { useTokenStore } from '@/stores/token'

// TODO change URL base on the external API
export const BASE = 'http://localhost:8632/api/v1'

// ── Private helpers ──────────────────────────────────────────────────────────

function getToken(): string {
  const store = useTokenStore()
  const token = store.getToken()
  if (!token) throw new Error('No auth token')
  return token
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Erreur ${response.status}`
    try {
      const data = await response.json()
      message = data.message || message
    } catch { /* ignore */ }
    throw new Error(message)
  }

  // Can return empty body
  const text = await response.text()
  return text ? JSON.parse(text) : (undefined as unknown as T)
}