import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/types'
import type { Task, User } from '@/lib/types'
import {
  MAX_TASK_TITLE_LENGTH,
  MAX_TASK_DESCRIPTION_LENGTH,
  STATUS_LABELS,
  PRIORITY_CONFIG,
} from '@/lib/constants'
import { Loader2 } from 'lucide-react'

const taskSchema = z.object({
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

type TaskFormInput = z.infer<typeof taskSchema>

type TaskModalProps =
  | {
      mode: 'create'
      projectId: string
      task?: never
      users: User[]
      open: boolean
      onOpenChange: (open: boolean) => void
      onSubmit: (data: TaskFormInput) => void
      isPending: boolean
    }
  | {
      mode: 'edit'
      projectId?: never
      task: Task
      users: User[]
      open: boolean
      onOpenChange: (open: boolean) => void
      onSubmit: (data: Partial<TaskFormInput>) => void
      onDelete?: () => void
      isPending: boolean
    }

export function TaskModal(props: TaskModalProps) {
  const { mode, users, open, onOpenChange, isPending } = props

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema),
    defaultValues:
      mode === 'edit'
        ? {
            title: props.task.title,
            description: props.task.description || '',
            status: props.task.status,
            priority: props.task.priority,
            assignee_id: props.task.assignee_id,
            due_date: props.task.due_date,
          }
        : {
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            assignee_id: null,
            due_date: null,
          },
  })

  const taskToEdit = mode === 'edit' ? props.task : null

  useEffect(() => {
    if (!open) return

    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        assignee_id: taskToEdit.assignee_id,
        due_date: taskToEdit.due_date,
      })
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee_id: null,
        due_date: null,
      })
    }
  }, [open, taskToEdit, reset])

  const currentStatus = watch('status')
  const currentPriority = watch('priority')
  const currentAssignee = watch('assignee_id')

  function onFormSubmit(data: TaskFormInput) {
    props.onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create task' : 'Edit task'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => void handleSubmit(onFormSubmit)(e)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Task title"
              maxLength={MAX_TASK_TITLE_LENGTH}
              aria-invalid={errors.title ? true : undefined}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">
              Description{' '}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="task-description"
              placeholder="Add a description..."
              maxLength={MAX_TASK_DESCRIPTION_LENGTH}
              rows={5}
              className="h-32 resize-none overflow-y-auto break-all"
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(val) =>
                setValue('status', val as TaskFormInput['status'])
              }
            >
              <SelectTrigger className="w-full" aria-label="Task status">
                <SelectValue>{STATUS_LABELS[currentStatus]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={currentPriority}
                onValueChange={(val) =>
                  setValue('priority', val as TaskFormInput['priority'])
                }
              >
                <SelectTrigger className="w-full" aria-label="Task priority">
                  <SelectValue>
                    {PRIORITY_CONFIG[currentPriority].label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_CONFIG[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={currentAssignee ?? 'unassigned'}
                onValueChange={(val) =>
                  setValue('assignee_id', val === 'unassigned' ? null : val)
                }
              >
                <SelectTrigger className="w-full" aria-label="Task assignee">
                  <SelectValue>
                    {currentAssignee
                      ? (users.find((u) => u.id === currentAssignee)?.name ??
                        'Unassigned')
                      : 'Unassigned'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-due-date">
              Due date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={watch('due_date') ?? ''}
              onChange={(e) => setValue('due_date', e.target.value || null)}
            />
          </div>

          <DialogFooter className="gap-2">
            {mode === 'edit' && props.onDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={props.onDelete}
                disabled={isPending}
                className="mr-auto"
              >
                Delete
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
