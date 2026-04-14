import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTask, updateTask, deleteTask } from '@/features/tasks/tasks.api'
import { TOAST_MESSAGES } from '@/lib/constants'

interface UseTaskMutationsOptions {
  projectId: string
  onCreated: () => void
  onEdited: () => void
}

export function useTaskMutations({
  projectId,
  onCreated,
  onEdited,
}: UseTaskMutationsOptions) {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['project', projectId] })

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof createTask>[1]) =>
      createTask(projectId, data),
    onSuccess: () => {
      void invalidate()
      toast.success(TOAST_MESSAGES.taskCreated)
      onCreated()
    },
    onError: () => toast.error(TOAST_MESSAGES.taskCreateFailed),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Parameters<typeof updateTask>[1]
    }) => updateTask(id, data),
    onSuccess: () => {
      void invalidate()
      toast.success(TOAST_MESSAGES.taskUpdated)
      onEdited()
    },
    onError: () => toast.error(TOAST_MESSAGES.taskUpdateFailed),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      void invalidate()
      toast.success(TOAST_MESSAGES.taskDeleted)
      onEdited()
    },
    onError: () => toast.error(TOAST_MESSAGES.taskDeleteFailed),
  })

  return { createMutation, updateMutation, deleteMutation }
}
