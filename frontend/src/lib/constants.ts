import type { TaskPriority, TaskStatus } from '@/lib/types'

// ---- App ----
export const APP_NAME = 'TaskFlow'

// ---- Layout ----
export const CONTENT_MAX_WIDTH = 'max-w-7xl'
export const NAVBAR_HEIGHT = 64
export const NAVBAR_HEIGHT_MOBILE = 56
export const KANBAN_COLUMN_MIN_WIDTH = 240

// ---- Query ----
export const QUERY_STALE_TIME = 30_000
export const QUERY_RETRY_COUNT = 1

// ---- Toast ----
export const TOAST_MAX_VISIBLE = 3
export const TOAST_POSITION = 'bottom-right' as const
export const TOAST_DURATION_SUCCESS = 3000
export const TOAST_DURATION_ERROR = 5000

// ---- Auth ----
export const AUTH_STORAGE_KEY = 'taskflow_user'
export const THEME_STORAGE_KEY = 'theme'
export const MIN_PASSWORD_LENGTH = 6

// ---- Content Limits ----
export const MAX_TASK_TITLE_LENGTH = 200
export const MAX_TASK_DESCRIPTION_LENGTH = 2000
export const MAX_PROJECT_NAME_LENGTH = 100
export const MAX_PROJECT_DESCRIPTION_LENGTH = 500
export const MAX_USER_NAME_LENGTH = 100
export const MAX_EMAIL_LENGTH = 254
export const MAX_PASSWORD_LENGTH = 128

// ---- Status Labels ----
export const STATUS_LABELS = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
} as const satisfies Record<TaskStatus, string>

// ---- Status Config ----
export const STATUS_CONFIG = {
  todo: {
    label: 'Todo',
    className: 'bg-slate-500 text-white dark:bg-slate-600',
    columnClassName: 'bg-slate-100/70 dark:bg-slate-900/40',
    columnOverClassName: 'bg-slate-200/80 dark:bg-slate-800/60',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-500 text-white dark:bg-amber-600',
    columnClassName: 'bg-amber-50/50 dark:bg-amber-950/15',
    columnOverClassName: 'bg-amber-50 dark:bg-amber-950/30',
  },
  done: {
    label: 'Done',
    className: 'bg-emerald-600 text-white dark:bg-emerald-700',
    columnClassName: 'bg-emerald-50/50 dark:bg-emerald-950/15',
    columnOverClassName: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
} as const satisfies Record<
  TaskStatus,
  {
    label: string
    className: string
    columnClassName: string
    columnOverClassName: string
  }
>

// ---- Priority Config ----
export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  medium: {
    label: 'Medium',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  low: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
} as const satisfies Record<TaskPriority, { label: string; className: string }>

// ---- Avatar Colors ----
export const AVATAR_COLORS = [
  'bg-blue-500 dark:bg-blue-600',
  'bg-emerald-500 dark:bg-emerald-600',
  'bg-purple-500 dark:bg-purple-600',
  'bg-rose-500 dark:bg-rose-600',
  'bg-amber-500 dark:bg-amber-600',
  'bg-cyan-500 dark:bg-cyan-600',
  'bg-indigo-500 dark:bg-indigo-600',
  'bg-pink-500 dark:bg-pink-600',
] as const

// ---- Empty States ----
export const EMPTY_STATES = {
  projects: {
    title: 'No projects yet',
    action: 'Create your first project',
  },
  column: {
    title: 'No tasks',
  },
  filtered: {
    title: 'No tasks match your filters',
    action: 'Clear filters',
  },
  projectNotFound: {
    title: 'Project not found',
    action: 'Back to projects',
  },
  pageNotFound: {
    title: 'Page not found',
    action: 'Go to dashboard',
  },
} as const

// ---- Toast Messages ----
export const TOAST_MESSAGES = {
  taskCreated: 'Task created',
  taskUpdated: 'Task updated',
  taskDeleted: 'Task deleted',
  taskMoveFailed: 'Failed to move task — reverted',
  taskCreateFailed: 'Failed to create task',
  taskUpdateFailed: 'Failed to update task',
  taskDeleteFailed: 'Failed to delete task',
  projectCreated: 'Project created',
  projectDeleted: 'Project deleted',
  projectCreateFailed: 'Failed to create project',
  projectDeleteFailed: 'Failed to delete project',
  sessionExpired: 'Session expired. Please log in again.',
  networkError: 'Network error. Check your connection.',
  logoutFailed: 'Failed to log out. Try again.',
} as const

// ---- Confirmation Dialogs ----
export const CONFIRM_DELETE_TASK = {
  title: 'Delete task?',
  description: (taskTitle: string) =>
    `This will permanently delete "${taskTitle}". This action cannot be undone.`,
  confirm: 'Delete',
  cancel: 'Cancel',
} as const

export const CONFIRM_DELETE_PROJECT = {
  title: 'Delete project?',
  description: (projectName: string) =>
    `This will permanently delete "${projectName}" and all its tasks. This action cannot be undone.`,
  confirm: 'Delete project',
  cancel: 'Cancel',
} as const

// ---- DnD ----
export const DND_TOUCH_DELAY = 200
export const DND_TOUCH_TOLERANCE = 5

// ---- Accessibility ----
export const DND_ANNOUNCEMENTS = {
  pickup: (title: string, status: string) =>
    `Picked up task: ${title}. Current column: ${status}.`,
  move: (status: string) => `Moved over column: ${status}.`,
  drop: (title: string, status: string) =>
    `Dropped task: ${title} in column: ${status}.`,
  cancel: (title: string, status: string) =>
    `Drag cancelled. Task returned to ${status}. Task: ${title}.`,
} as const
