import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { TaskFormFields } from '@/features/tasks/TaskFormFields'
import { useTaskForm } from '@/features/tasks/useTaskForm'
import type { TaskFormInput } from '@/lib/schemas'
import type { Task, User } from '@/lib/types'
import { Loader2 } from 'lucide-react'

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
  const form = useTaskForm({
    task: mode === 'edit' ? props.task : null,
    open,
  })

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
          onSubmit={(e) => void form.handleSubmit(onFormSubmit)(e)}
          className="space-y-4"
        >
          <TaskFormFields form={form} users={users} />

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
