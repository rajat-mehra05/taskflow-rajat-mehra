import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { NotFoundPage } from '@/components/layout/NotFoundPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ProjectsListPage } from '@/features/projects/ProjectsListPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { DevApiTest } from '@/features/dev/DevApiTest'

const devRoutes = import.meta.env.DEV
  ? [{ path: '/dev', element: <DevApiTest /> }]
  : []

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  ...devRoutes,
  {
    path: '/',
    element: <Navigate to="/projects" replace />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/projects',
        element: <ProjectsListPage />,
      },
      {
        path: '/projects/:id',
        element: <ProjectDetailPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
