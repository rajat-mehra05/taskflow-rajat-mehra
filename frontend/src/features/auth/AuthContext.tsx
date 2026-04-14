import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/lib/types'
import * as authApi from '@/features/auth/auth.api'
import { AUTH_STORAGE_KEY } from '@/lib/constants'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

function persistUser(user: User | null) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

function loadPersistedUser(): User | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadPersistedUser())
  const [isLoading, setIsLoading] = useState(() => loadPersistedUser() !== null)

  // Validate persisted session with /auth/me
  useEffect(() => {
    if (!user) return

    authApi
      .getMe()
      .then((response) => {
        setUser(response.user)
        persistUser(response.user)
      })
      .catch(() => {
        setUser(null)
        persistUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    setUser(response.user)
    persistUser(response.user)
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await authApi.register(name, email, password)
      setUser(response.user)
      persistUser(response.user)
    },
    [],
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    persistUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
