import type { User, Project, Task } from '@/lib/types'

// Stable UUIDs for seed data — predictable for testing
const USER_1_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const USER_2_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901'

const PROJECT_1_ID = 'p1a2b3c4-d5e6-7890-abcd-ef1234567890'
const PROJECT_2_ID = 'p2b3c4d5-e6f7-8901-bcde-f12345678901'

// Passwords stored as plain text in mock — MSW compares directly
// In production, this would be bcrypt hashed
interface SeedUser extends User {
  password: string
}

export const seedUsers: SeedUser[] = [
  {
    id: USER_1_ID,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: USER_2_ID,
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'secret123',
    created_at: '2026-04-02T10:00:00Z',
  },
]

export const seedProjects: Project[] = [
  {
    id: PROJECT_1_ID,
    name: 'Website Redesign',
    description: 'Q2 project — redesign the marketing site',
    owner_id: USER_1_ID,
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: PROJECT_2_ID,
    name: 'Mobile App',
    description: 'Build the iOS and Android app',
    owner_id: USER_2_ID,
    created_at: '2026-04-03T10:00:00Z',
  },
]

export const seedTasks: Task[] = [
  // Project 1 tasks — mix of statuses, priorities, assignees
  {
    id: 't1000001-0000-0000-0000-000000000001',
    title: 'Design homepage mockup',
    description:
      'Create wireframes and high-fidelity mockups for the new homepage',
    status: 'todo',
    priority: 'high',
    project_id: PROJECT_1_ID,
    assignee_id: USER_1_ID,
    due_date: '2026-04-20',
    created_at: '2026-04-05T10:00:00Z',
    updated_at: '2026-04-05T10:00:00Z',
  },
  {
    id: 't1000001-0000-0000-0000-000000000002',
    title: 'Set up CI/CD pipeline',
    description:
      'Configure GitHub Actions for automated testing and deployment',
    status: 'in_progress',
    priority: 'medium',
    project_id: PROJECT_1_ID,
    assignee_id: USER_2_ID,
    due_date: '2026-04-15',
    created_at: '2026-04-04T10:00:00Z',
    updated_at: '2026-04-06T10:00:00Z',
  },
  {
    id: 't1000001-0000-0000-0000-000000000003',
    title: 'Write API documentation',
    description: '',
    status: 'done',
    priority: 'low',
    project_id: PROJECT_1_ID,
    assignee_id: USER_1_ID,
    due_date: '2026-04-10',
    created_at: '2026-04-03T10:00:00Z',
    updated_at: '2026-04-09T10:00:00Z',
  },
  {
    id: 't1000001-0000-0000-0000-000000000004',
    title: 'Implement dark mode',
    description: 'Add theme toggle and dark mode styles across all pages',
    status: 'todo',
    priority: 'medium',
    project_id: PROJECT_1_ID,
    assignee_id: null,
    due_date: null,
    created_at: '2026-04-06T10:00:00Z',
    updated_at: '2026-04-06T10:00:00Z',
  },
  // Project 2 tasks
  {
    id: 't2000001-0000-0000-0000-000000000001',
    title: 'Set up React Native project',
    description: 'Initialize the project with Expo and configure navigation',
    status: 'in_progress',
    priority: 'high',
    project_id: PROJECT_2_ID,
    assignee_id: USER_2_ID,
    due_date: '2026-04-18',
    created_at: '2026-04-05T10:00:00Z',
    updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 't2000001-0000-0000-0000-000000000002',
    title: 'Design app icon',
    description: '',
    status: 'done',
    priority: 'low',
    project_id: PROJECT_2_ID,
    assignee_id: USER_1_ID,
    due_date: '2026-04-08',
    created_at: '2026-04-03T10:00:00Z',
    updated_at: '2026-04-08T10:00:00Z',
  },
]

// ---- In-memory database ----
// MSW handlers mutate these arrays to simulate a real API

let users = [...seedUsers]
let projects = [...seedProjects]
let tasks = [...seedTasks]

export const db = {
  // Users
  getUsers: () => users,
  getUserByEmail: (email: string) => users.find((u) => u.email === email),
  getUserById: (id: string) => users.find((u) => u.id === id),
  createUser: (user: SeedUser) => {
    users.push(user)
    return user
  },

  // Projects
  getProjects: () => projects,
  getProjectById: (id: string) => projects.find((p) => p.id === id),
  getProjectsForUser: (userId: string) => {
    const ownedProjectIds = new Set(
      projects.filter((p) => p.owner_id === userId).map((p) => p.id),
    )
    const assignedProjectIds = new Set(
      tasks.filter((t) => t.assignee_id === userId).map((t) => t.project_id),
    )
    return projects.filter(
      (p) => ownedProjectIds.has(p.id) || assignedProjectIds.has(p.id),
    )
  },
  createProject: (project: Project) => {
    projects.push(project)
    return project
  },
  updateProject: (id: string, updates: Partial<Project>) => {
    const existing = projects.find((p) => p.id === id)
    if (!existing) return null
    const updated = { ...existing, ...updates }
    projects = projects.map((p) => (p.id === id ? updated : p))
    return updated
  },
  deleteProject: (id: string) => {
    projects = projects.filter((p) => p.id !== id)
    tasks = tasks.filter((t) => t.project_id !== id)
  },

  // Tasks
  getTasksByProjectId: (projectId: string) =>
    tasks.filter((t) => t.project_id === projectId),
  getTaskById: (id: string) => tasks.find((t) => t.id === id),
  createTask: (task: Task) => {
    tasks.push(task)
    return task
  },
  updateTask: (id: string, updates: Partial<Task>) => {
    const existing = tasks.find((t) => t.id === id)
    if (!existing) return null
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    }
    tasks = tasks.map((t) => (t.id === id ? updated : t))
    return updated
  },
  deleteTask: (id: string) => {
    tasks = tasks.filter((t) => t.id !== id)
  },

  // Reset for tests
  reset: () => {
    users = [...seedUsers]
    projects = [...seedProjects]
    tasks = [...seedTasks]
  },
}
