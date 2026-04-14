import { api } from '@/lib/api-client'
import type { Project, ProjectWithTasks, ProjectsResponse } from '@/lib/types'

export function getProjects(): Promise<ProjectsResponse> {
  return api.get('/projects')
}

export function getProject(id: string): Promise<ProjectWithTasks> {
  return api.get(`/projects/${id}`)
}

export function createProject(data: {
  name: string
  description?: string
}): Promise<Project> {
  return api.post('/projects', data)
}

export function updateProject(
  id: string,
  data: Partial<Pick<Project, 'name' | 'description'>>,
): Promise<Project> {
  return api.patch(`/projects/${id}`, data)
}

export function deleteProject(id: string): Promise<void> {
  return api.delete(`/projects/${id}`)
}
