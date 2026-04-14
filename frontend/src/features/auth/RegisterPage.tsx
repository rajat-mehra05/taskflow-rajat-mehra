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
  MAX_USER_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '@/lib/constants'
import { Loader2 } from 'lucide-react'

const registerSchema = z.object({
  name: z
    .string()
    .min(1, { error: 'Name is required' })
    .max(MAX_USER_NAME_LENGTH),
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      error: `Must be at least ${MIN_PASSWORD_LENGTH} characters`,
    })
    .max(MAX_PASSWORD_LENGTH),
})

type RegisterInput = z.infer<typeof registerSchema>

export function RegisterPage() {
  const {
    register: registerUser,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

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

  async function onSubmit(data: RegisterInput) {
    setServerError('')
    try {
      await registerUser(data.name, data.email, data.password)
      void navigate('/projects', { replace: true })
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.body.fields) {
          for (const [field, message] of Object.entries(err.body.fields)) {
            if (field === 'name' || field === 'email' || field === 'password') {
              setError(field, { message })
            }
          }
        } else {
          setServerError(err.body.error)
        }
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
          <CardDescription>Create your account</CardDescription>
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'name-error' : undefined}
                {...register('name')}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
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
                autoComplete="new-password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? 'password-error' : 'password-hint'
                }
                {...register('password')}
              />
              {errors.password ? (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : (
                <p id="password-hint" className="text-sm text-muted-foreground">
                  Must be at least {MIN_PASSWORD_LENGTH} characters
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
