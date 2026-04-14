import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/data'

// In-memory session — MSW Service Workers can't use real cookies
// In production, this would be an HTTP-only cookie set by the backend
let currentSessionUserId: string | null = null

// Generate a fake JWT for spec compliance — not used for auth, just for response shape
function generateMockToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({ user_id: userId, exp: Date.now() + 86400000 }),
  )
  return `${header}.${payload}.mock-signature`
}

export function getSessionUser() {
  if (!currentSessionUserId) return null
  return db.getUserById(currentSessionUserId) ?? null
}

export function clearSession() {
  currentSessionUserId = null
}

export const authHandlers = [
  // POST /auth/register
  http.post('/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string
      email?: string
      password?: string
    }

    const name = body.name?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const password = body.password ?? ''

    const fields: Record<string, string> = {}
    if (!name) fields.name = 'is required'
    if (!email) fields.email = 'is required'
    if (password.length < 6) fields.password = 'must be at least 6 characters'

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        { error: 'validation failed', fields },
        { status: 400 },
      )
    }

    if (db.getUserByEmail(email)) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { email: 'already registered' } },
        { status: 400 },
      )
    }

    const newUser = db.createUser({
      id: crypto.randomUUID(),
      name,
      email,
      password,
      created_at: new Date().toISOString(),
    })

    // Set in-memory session
    currentSessionUserId = newUser.id

    const { password: _, ...user } = newUser

    return HttpResponse.json(
      { token: generateMockToken(user.id), user },
      { status: 201 },
    )
  }),

  // POST /auth/login
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    const email = body.email?.trim() ?? ''
    const password = body.password ?? ''

    const fields: Record<string, string> = {}
    if (!email) fields.email = 'is required'
    if (!password) fields.password = 'is required'

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        { error: 'validation failed', fields },
        { status: 400 },
      )
    }

    const user = db.getUserByEmail(email)
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { error: 'invalid email or password' },
        { status: 401 },
      )
    }

    // Set in-memory session
    currentSessionUserId = user.id

    const { password: _, ...safeUser } = user

    return HttpResponse.json({
      token: generateMockToken(user.id),
      user: safeUser,
    })
  }),

  // GET /auth/me
  http.get('/auth/me', () => {
    const user = currentSessionUserId
      ? db.getUserById(currentSessionUserId)
      : null

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { password: _, ...safeUser } = user

    return HttpResponse.json({ user: safeUser })
  }),

  // POST /auth/logout
  http.post('/auth/logout', () => {
    currentSessionUserId = null
    return HttpResponse.json({ message: 'logged out' })
  }),
]
