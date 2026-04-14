import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/data'

// Mock session lives in localStorage so it survives page reloads — mirrors what
// an HTTP-only auth cookie would do in production. In-memory state would reset
// every reload and bounce the user back to /login.
const SESSION_KEY = 'mock_session_user_id'

function setSessionUserId(id: string | null) {
  if (id) localStorage.setItem(SESSION_KEY, id)
  else localStorage.removeItem(SESSION_KEY)
}

function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

// Generate a fake JWT for spec compliance — not used for auth, just for response shape
function generateMockToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({ user_id: userId, exp: Date.now() + 86400000 }),
  )
  return `${header}.${payload}.mock-signature`
}

export function getSessionUser() {
  const id = getSessionUserId()
  if (!id) return null
  return db.getUserById(id) ?? null
}

export function clearSession() {
  setSessionUserId(null)
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

    setSessionUserId(newUser.id)

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

    setSessionUserId(user.id)

    const { password: _, ...safeUser } = user

    return HttpResponse.json({
      token: generateMockToken(user.id),
      user: safeUser,
    })
  }),

  // GET /auth/me
  http.get('/auth/me', () => {
    const id = getSessionUserId()
    const user = id ? db.getUserById(id) : null

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { password: _, ...safeUser } = user

    return HttpResponse.json({ user: safeUser })
  }),

  // POST /auth/logout
  http.post('/auth/logout', () => {
    setSessionUserId(null)
    return HttpResponse.json({ message: 'logged out' })
  }),
]
