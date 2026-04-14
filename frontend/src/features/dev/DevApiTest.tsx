import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as authApi from '@/features/auth/auth.api'
import * as projectsApi from '@/features/projects/projects.api'
import * as tasksApi from '@/features/tasks/tasks.api'

// Temporary dev page — delete before Phase 3
// Tests every MSW endpoint and displays the response JSON

export function DevApiTest() {
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  function run(label: string, fn: () => Promise<unknown>) {
    setError('')
    setResult('Loading...')
    fn()
      .then((data) => {
        const json = JSON.stringify(data, null, 2)
        setResult(`${label}\n\n${json}`)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(`${label}\n\n${message}`)
        setResult('')
      })
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">API Test Page (Dev Only)</h1>
      <p className="text-muted-foreground">
        Click any button to fire the API call. Check the console for MSW logs.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Auth */}
        <Card>
          <CardHeader>
            <CardTitle>Auth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() =>
                run('POST /auth/login', () =>
                  authApi.login('test@example.com', 'password123'),
                )
              }
            >
              Login (test@example.com)
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                run('POST /auth/login (bad)', () =>
                  authApi.login('test@example.com', 'wrong'),
                )
              }
            >
              Login (wrong password)
            </Button>
            <Button
              className="w-full"
              onClick={() => run('GET /auth/me', () => authApi.getMe())}
            >
              Get Me
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                run('POST /auth/register', () =>
                  authApi.register('New User', 'new@example.com', 'pass123456'),
                )
              }
            >
              Register (new@example.com)
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => run('POST /auth/logout', () => authApi.logout())}
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() =>
                run('GET /projects', () => projectsApi.getProjects())
              }
            >
              List Projects
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                run('GET /projects/:id', () =>
                  projectsApi.getProject(
                    'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
                  ),
                )
              }
            >
              Get Project 1 (with tasks)
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                run('POST /projects', () =>
                  projectsApi.createProject({
                    name: 'Test Project',
                    description: 'Created from dev page',
                  }),
                )
              }
            >
              Create Project
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                run('GET /projects/invalid', () =>
                  projectsApi.getProject('invalid-id'),
                )
              }
            >
              Get Project (404)
            </Button>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() =>
                run('GET /projects/:id/tasks', () =>
                  tasksApi.getTasks({
                    projectId: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
                  }),
                )
              }
            >
              List Tasks (Project 1)
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                run('GET tasks ?status=todo', () =>
                  tasksApi.getTasks({
                    projectId: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
                    status: 'todo',
                  }),
                )
              }
            >
              List Tasks (status=todo)
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                run('POST /projects/:id/tasks', () =>
                  tasksApi.createTask('p1a2b3c4-d5e6-7890-abcd-ef1234567890', {
                    title: 'New test task',
                    priority: 'high',
                    due_date: '2026-05-01',
                  }),
                )
              }
            >
              Create Task
            </Button>
            <Button
              className="w-full"
              onClick={() =>
                run('PATCH /tasks/:id', () =>
                  tasksApi.updateTask('t1000001-0000-0000-0000-000000000001', {
                    status: 'in_progress',
                    title: 'Updated title',
                  }),
                )
              }
            >
              Update Task (status → in_progress)
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() =>
                run('DELETE /tasks/:id', () =>
                  tasksApi.deleteTask('t1000001-0000-0000-0000-000000000004'),
                )
              }
            >
              Delete Task
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Response display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto whitespace-pre-wrap rounded bg-muted p-4 text-sm">
              {result}
            </pre>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-auto whitespace-pre-wrap rounded bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
