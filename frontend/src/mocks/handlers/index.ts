import { authHandlers } from '@/mocks/handlers/auth'
import { projectHandlers } from '@/mocks/handlers/projects'
import { taskHandlers } from '@/mocks/handlers/tasks'

export const handlers = [...authHandlers, ...projectHandlers, ...taskHandlers]
