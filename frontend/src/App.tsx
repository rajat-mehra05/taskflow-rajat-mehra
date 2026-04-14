import { Agentation } from 'agentation'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { AuthProvider } from '@/features/auth/AuthContext'
import { router } from '@/routes'
import {
  QUERY_STALE_TIME,
  QUERY_RETRY_COUNT,
  TOAST_MAX_VISIBLE,
  TOAST_POSITION,
} from '@/lib/constants'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      retry: QUERY_RETRY_COUNT,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            position={TOAST_POSITION}
            visibleToasts={TOAST_MAX_VISIBLE}
          />
        </AuthProvider>
      </QueryClientProvider>
      {import.meta.env.DEV && <Agentation />}
    </ErrorBoundary>
  )
}

export default App
