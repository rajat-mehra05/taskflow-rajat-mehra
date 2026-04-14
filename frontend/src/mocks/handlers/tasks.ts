import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/data'
import { getSessionUser } from '@/mocks/handlers/auth'
import { TASK_STATUSES } from '@/lib/types'
import type { TaskStatus } from '@/lib/types'

function isValidStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === 'string' &&
    (TASK_STATUSES as readonly string[]).includes(value)
  )
}

export const taskHandlers = [
  // GET /projects/:id/tasks — supports ?status= and ?assignee= filters
  http.get('/projects/:id/tasks', ({ params, request }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const project = db.getProjectById(params.id as string)
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }

    let tasks = db.getTasksByProjectId(project.id)

    const url = new URL(request.url)
    const statusFilter = url.searchParams.get('status')
    const assigneeFilter = url.searchParams.get('assignee')

    if (statusFilter) {
      tasks = tasks.filter((t) => t.status === statusFilter)
    }
    if (assigneeFilter) {
      tasks = tasks.filter((t) => t.assignee_id === assigneeFilter)
    }

    return HttpResponse.json({ tasks })
  }),

  // POST /projects/:id/tasks
  http.post('/projects/:id/tasks', async ({ params, request }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const project = db.getProjectById(params.id as string)
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }

    const body = (await request.json()) as {
      title?: string
      description?: string
      status?: TaskStatus
      priority?: string
      assignee_id?: string | null
      due_date?: string | null
    }

    if (!body.title?.trim()) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { title: 'is required' } },
        { status: 400 },
      )
    }

    if (body.status !== undefined && !isValidStatus(body.status)) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { status: 'invalid value' } },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()
    const task = db.createTask({
      id: crypto.randomUUID(),
      title: body.title.trim(),
      description: body.description?.trim() ?? '',
      status: body.status ?? 'todo',
      priority: (body.priority as 'low' | 'medium' | 'high') ?? 'medium',
      project_id: project.id,
      assignee_id: body.assignee_id ?? null,
      due_date: body.due_date ?? null,
      created_at: now,
      updated_at: now,
    })

    return HttpResponse.json(task, { status: 201 })
  }),

  // PATCH /tasks/:id
  http.patch('/tasks/:id', async ({ params, request }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const task = db.getTaskById(params.id as string)
    if (!task) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }

    const body = (await request.json()) as {
      title?: string
      description?: string
      status?: TaskStatus
      priority?: string
      assignee_id?: string | null
      due_date?: string | null
    }

    if (body.status !== undefined && !isValidStatus(body.status)) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { status: 'invalid value' } },
        { status: 400 },
      )
    }

    const updated = db.updateTask(task.id, {
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.description !== undefined && {
        description: body.description.trim(),
      }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.priority !== undefined && {
        priority: body.priority as 'low' | 'medium' | 'high',
      }),
      ...(body.assignee_id !== undefined && {
        assignee_id: body.assignee_id,
      }),
      ...(body.due_date !== undefined && { due_date: body.due_date }),
    })

    return HttpResponse.json(updated)
  }),

  // DELETE /tasks/:id
  http.delete('/tasks/:id', ({ params }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const task = db.getTaskById(params.id as string)
    if (!task) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }

    db.deleteTask(task.id)

    return new HttpResponse(null, { status: 204 })
  }),
]
