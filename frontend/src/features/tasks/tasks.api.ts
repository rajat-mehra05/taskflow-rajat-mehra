import { api } from '@/lib/api-client'
import type { Task, TasksResponse, TaskStatus, TaskPriority } from '@/lib/types'

interface GetTasksParams {
  projectId: string
  status?: TaskStatus
  assignee?: string
}

export function getTasks({
  projectId,
  status,
  assignee,
}: GetTasksParams): Promise<TasksResponse> {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (assignee) params.set('assignee', assignee)

  const query = params.toString()
  const url = `/projects/${projectId}/tasks${query ? `?${query}` : ''}`

  return api.get(url)
}

export function createTask(
  projectId: string,
  data: {
    title: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    assignee_id?: string | null
    due_date?: string | null
  },
): Promise<Task> {
  return api.post(`/projects/${projectId}/tasks`, data)
}

export function updateTask(
  id: string,
  data: Partial<
    Pick<
      Task,
      | 'title'
      | 'description'
      | 'status'
      | 'priority'
      | 'assignee_id'
      | 'due_date'
    >
  >,
): Promise<Task> {
  return api.patch(`/tasks/${id}`, data)
}

export function deleteTask(id: string): Promise<void> {
  return api.delete(`/tasks/${id}`)
}
