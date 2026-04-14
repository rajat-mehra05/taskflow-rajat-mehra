import { z } from 'zod'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/types'
import {
  MAX_TASK_TITLE_LENGTH,
  MAX_TASK_DESCRIPTION_LENGTH,
} from '@/lib/constants'

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'Title is required' })
    .max(MAX_TASK_TITLE_LENGTH),
  description: z.string().max(MAX_TASK_DESCRIPTION_LENGTH).optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  assignee_id: z.string().nullable(),
  due_date: z.string().nullable(),
})

export type TaskFormInput = z.infer<typeof taskSchema>
