import {request, BASE} from './helper'

/**
 * Call login api endpoint to log in.
 * 
 * @param email 
 * @param username 
 * @param password 
 * @returns The API response content
 * @throws Error When there is an API issue
 */
export async function apiLogin(
  email: string,
  username: string,
  password: string
): Promise<{ access_token: string; refresh_token: string }> {
  const response = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || `Mauvais identifiants`)
  }

  return response.json()
}


/**
 * Call register api endpoint to create new user
 * 
 * @param email 
 * @param username 
 * @param password 
 * @returns The API response content
 * @throws Error When there is an API issue
 */
export async function apiRegister(
  email: string,
  username: string,
  password: string
): Promise<{ access_token: string; refresh_token: string }> {
  const response = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || `Mauvais identifiants`)
  }

  return response.json()
}

export async function apiExtendSession(): Promise<{ token: string; admin: boolean }> {
  return request('/protected/extend_session', { method: 'POST' })
}