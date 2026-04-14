import { api } from '@/lib/api-client'
import type { AuthResponse, MeResponse } from '@/lib/types'

export function login(email: string, password: string): Promise<AuthResponse> {
  return api.post('/auth/login', { email, password })
}

export function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return api.post('/auth/register', { name, email, password })
}

export function getMe(): Promise<MeResponse> {
  return api.get('/auth/me')
}

export function logout(): Promise<void> {
  return api.post('/auth/logout', {})
}
