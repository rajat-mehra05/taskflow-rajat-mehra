import { Navigate, Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { useAuth } from '@/features/auth/AuthContext'
import { CONTENT_MAX_WIDTH } from '@/lib/constants'
import { Loader2 } from 'lucide-react'

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">Authenticating...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`mx-auto px-4 py-6 sm:px-6 ${CONTENT_MAX_WIDTH}`}>
        <Outlet />
      </main>
    </div>
  )
}
