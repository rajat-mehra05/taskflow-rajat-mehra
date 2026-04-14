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
  // ---- Project 1: Website Redesign ---- (3 todo, 1 in_progress, 1 done)
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
    title: 'Implement dark mode',
    description: 'Add theme toggle and dark mode styles across all pages',
    status: 'todo',
    priority: 'medium',
    project_id: PROJECT_1_ID,
    assignee_id: null,
    due_date: '2026-04-25',
    created_at: '2026-04-06T10:00:00Z',
    updated_at: '2026-04-06T10:00:00Z',
  },
  {
    id: 't1000001-0000-0000-0000-000000000003',
    title: 'Audit current SEO metadata',
    description:
      'Review existing meta tags, OG images, and sitemap before migration',
    status: 'todo',
    priority: 'low',
    project_id: PROJECT_1_ID,
    assignee_id: USER_2_ID,
    due_date: '2026-04-22',
    created_at: '2026-04-07T10:00:00Z',
    updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 't1000001-0000-0000-0000-000000000004',
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
    id: 't1000001-0000-0000-0000-000000000005',
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

  // ---- Project 2: Mobile App ---- (3 todo, 1 in_progress, 1 done)
  {
    id: 't2000001-0000-0000-0000-000000000001',
    title: 'Draft onboarding screens',
    description: 'Sketch the 3-step onboarding flow and review with design',
    status: 'todo',
    priority: 'high',
    project_id: PROJECT_2_ID,
    assignee_id: USER_2_ID,
    due_date: '2026-04-21',
    created_at: '2026-04-06T10:00:00Z',
    updated_at: '2026-04-06T10:00:00Z',
  },
  {
    id: 't2000001-0000-0000-0000-000000000002',
    title: 'Integrate push notifications',
    description: 'Wire up FCM for Android and APNs for iOS',
    status: 'todo',
    priority: 'medium',
    project_id: PROJECT_2_ID,
    assignee_id: USER_1_ID,
    due_date: '2026-04-28',
    created_at: '2026-04-07T10:00:00Z',
    updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 't2000001-0000-0000-0000-000000000003',
    title: 'Configure analytics SDK',
    description: '',
    status: 'todo',
    priority: 'low',
    project_id: PROJECT_2_ID,
    assignee_id: null,
    due_date: null,
    created_at: '2026-04-08T10:00:00Z',
    updated_at: '2026-04-08T10:00:00Z',
  },
  {
    id: 't2000001-0000-0000-0000-000000000004',
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
    id: 't2000001-0000-0000-0000-000000000005',
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

// ---- In-memory database, mirrored to localStorage ----
// MSW mutations are written through to localStorage so that projects and
// tasks created in a session survive page reloads. Without this, a reviewer
// who creates a task and hits refresh sees it vanish and assumes the app is
// broken. On init we hydrate from storage; on mutation we flush.

const DB_STORAGE_KEY = 'mock_db_v1'

interface PersistedDb {
  users: SeedUser[]
  projects: Project[]
  tasks: Task[]
}

function freshDb(): PersistedDb {
  return {
    users: [...seedUsers],
    projects: [...seedProjects],
    tasks: [...seedTasks],
  }
}

function loadDb(): PersistedDb {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY)
    if (!raw) return freshDb()
    const parsed = JSON.parse(raw) as Partial<PersistedDb>
    if (!parsed.users || !parsed.projects || !parsed.tasks) return freshDb()
    return {
      users: parsed.users,
      projects: parsed.projects,
      tasks: parsed.tasks,
    }
  } catch {
    return freshDb()
  }
}

function persist() {
  try {
    localStorage.setItem(
      DB_STORAGE_KEY,
      JSON.stringify({ users, projects, tasks }),
    )
  } catch {
    // Storage quota or private-mode failure — fall back to in-memory only.
  }
}

let { users, projects, tasks } = loadDb()

export const db = {
  // Users
  getUsers: () => users,
  getUserByEmail: (email: string) => users.find((u) => u.email === email),
  getUserById: (id: string) => users.find((u) => u.id === id),
  createUser: (user: SeedUser) => {
    users.push(user)
    persist()
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
    persist()
    return project
  },
  updateProject: (id: string, updates: Partial<Project>) => {
    const existing = projects.find((p) => p.id === id)
    if (!existing) return null
    const updated = { ...existing, ...updates }
    projects = projects.map((p) => (p.id === id ? updated : p))
    persist()
    return updated
  },
  deleteProject: (id: string) => {
    projects = projects.filter((p) => p.id !== id)
    tasks = tasks.filter((t) => t.project_id !== id)
    persist()
  },

  // Tasks
  getTasksByProjectId: (projectId: string) =>
    tasks.filter((t) => t.project_id === projectId),
  getTaskById: (id: string) => tasks.find((t) => t.id === id),
  createTask: (task: Task) => {
    tasks.push(task)
    persist()
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
    persist()
    return updated
  },
  deleteTask: (id: string) => {
    tasks = tasks.filter((t) => t.id !== id)
    persist()
  },

  // Reset back to seed data — used by tests and available as an escape hatch.
  reset: () => {
    const fresh = freshDb()
    users = fresh.users
    projects = fresh.projects
    tasks = fresh.tasks
    try {
      localStorage.removeItem(DB_STORAGE_KEY)
    } catch {
      // Storage inaccessible — in-memory reset still applies.
    }
  },
}
