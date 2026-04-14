import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function bootstrap() {
  // MSW runs in both dev and prod — this is a frontend-only submission with
  // no real backend, so the mock worker IS the API in every environment.
  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })

  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element not found')

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
