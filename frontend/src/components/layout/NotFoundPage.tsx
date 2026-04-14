import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { EMPTY_STATES } from '@/lib/constants'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">
        {EMPTY_STATES.pageNotFound.title}
      </p>
      <Link to="/projects">
        <Button className="mt-6">{EMPTY_STATES.pageNotFound.action}</Button>
      </Link>
    </div>
  )
}
