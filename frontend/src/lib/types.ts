// Derived from the spec's data model — single source of truth for all types

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
}

export interface ProjectWithTasks extends Project {
  tasks: Task[]
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  project_id: string
  assignee_id: string | null
  due_date: string | null
  created_at: string
  updated_at: string
}

// API response shapes
// Auth is cookie-based (api-client sends credentials: 'include'); `token` is
// kept only to match the spec's response shape and is intentionally unused.
export interface AuthResponse {
  token: string
  user: User
}

export interface MeResponse {
  user: User
}

export interface ProjectsResponse {
  projects: Project[]
}

export interface TasksResponse {
  tasks: Task[]
}
