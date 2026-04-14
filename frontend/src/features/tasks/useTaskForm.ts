import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskFormInput } from '@/lib/schemas'
import type { Task } from '@/lib/types'

const EMPTY_VALUES: TaskFormInput = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignee_id: null,
  due_date: null,
}

function valuesFromTask(task: Task): TaskFormInput {
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    assignee_id: task.assignee_id,
    due_date: task.due_date,
  }
}

interface UseTaskFormArgs {
  task: Task | null
  open: boolean
}

export function useTaskForm({ task, open }: UseTaskFormArgs) {
  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? valuesFromTask(task) : EMPTY_VALUES,
  })

  // Reset form when the dialog (re)opens — keeps create and edit flows
  // in sync with the current task prop without stale values leaking across.
  useEffect(() => {
    if (!open) return
    form.reset(task ? valuesFromTask(task) : EMPTY_VALUES)
  }, [open, task, form])

  return form
}
