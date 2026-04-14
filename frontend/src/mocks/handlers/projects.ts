import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/data'
import { getSessionUser } from '@/mocks/handlers/auth'

export const projectHandlers = [
  // GET /projects
  http.get('/projects', () => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const projects = db.getProjectsForUser(user.id)

    return HttpResponse.json({ projects })
  }),

  // POST /projects
  http.post('/projects', async ({ request }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as {
      name?: string
      description?: string
    }

    if (!body.name?.trim()) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { name: 'is required' } },
        { status: 400 },
      )
    }

    const project = db.createProject({
      id: crypto.randomUUID(),
      name: body.name.trim(),
      description: body.description?.trim() ?? '',
      owner_id: user.id,
      created_at: new Date().toISOString(),
    })

    return HttpResponse.json(project, { status: 201 })
  }),

  // GET /projects/:id
  http.get('/projects/:id', ({ params }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const project = db.getProjectById(params.id as string)
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }

    const tasks = db.getTasksByProjectId(project.id)

    return HttpResponse.json({ ...project, tasks })
  }),

  // PATCH /projects/:id
  http.patch('/projects/:id', async ({ params, request }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const project = db.getProjectById(params.id as string)
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }

    if (project.owner_id !== user.id) {
      return HttpResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const body = (await request.json()) as {
      name?: string
      description?: string
    }

    const updated = db.updateProject(project.id, {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.description !== undefined && {
        description: body.description.trim(),
      }),
    })

    return HttpResponse.json(updated)
  }),

  // DELETE /projects/:id
  http.delete('/projects/:id', ({ params }) => {
    const user = getSessionUser()

    if (!user) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const project = db.getProjectById(params.id as string)
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }

    if (project.owner_id !== user.id) {
      return HttpResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    db.deleteProject(project.id)

    return new HttpResponse(null, { status: 204 })
  }),
]
