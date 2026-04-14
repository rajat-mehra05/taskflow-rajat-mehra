import type { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/types'
import type { User } from '@/lib/types'
import {
  MAX_TASK_TITLE_LENGTH,
  MAX_TASK_DESCRIPTION_LENGTH,
  STATUS_LABELS,
  PRIORITY_CONFIG,
} from '@/lib/constants'
import type { TaskFormInput } from '@/lib/schemas'

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormInput>
  users: User[]
}

export function TaskFormFields({ form, users }: TaskFormFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form

  const currentStatus = watch('status')
  const currentPriority = watch('priority')
  const currentAssignee = watch('assignee_id')
  const assigneeName = currentAssignee
    ? (users.find((u) => u.id === currentAssignee)?.name ?? 'Unassigned')
    : 'Unassigned'

  return (
    <>
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
          Description <span className="text-muted-foreground">(optional)</span>
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
              <SelectValue>{assigneeName}</SelectValue>
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
    </>
  )
}
