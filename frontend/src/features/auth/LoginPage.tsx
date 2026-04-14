import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/features/auth/AuthContext'
import { ApiRequestError } from '@/lib/api-client'
import {
  APP_NAME,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '@/lib/constants'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      error: `Must be at least ${MIN_PASSWORD_LENGTH} characters`,
    })
    .max(MAX_PASSWORD_LENGTH),
})

type LoginInput = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })
  const [guestLoading, setGuestLoading] = useState(false)

  async function signInAsGuest() {
    const creds = { email: 'test@example.com', password: 'password123' }
    setServerError('')
    setValue('email', creds.email)
    setValue('password', creds.password)
    setGuestLoading(true)
    try {
      await login(creds.email, creds.password)
      void navigate('/projects', { replace: true })
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setServerError(err.body.error)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } finally {
      setGuestLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />
  }

  async function onSubmit(data: LoginInput) {
    setServerError('')
    try {
      await login(data.email, data.password)
      void navigate('/projects', { replace: true })
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setServerError(err.body.error)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{APP_NAME}</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </div>
          )}
          <form
            onSubmit={(e) => void handleSubmit(onSubmit)(e)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || guestLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-border" />
              <span className="mx-3 text-xs uppercase text-muted-foreground">
                Or
              </span>
              <div className="flex-grow border-t border-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              disabled={isSubmitting || guestLoading}
              onClick={() => void signInAsGuest()}
            >
              {guestLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Continue as Test User'
              )}
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
