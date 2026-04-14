import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { updateTask } from '@/features/tasks/tasks.api'
import type { Task, TaskStatus, ProjectWithTasks } from '@/lib/types'
import {
  DND_TOUCH_DELAY,
  DND_TOUCH_TOLERANCE,
  STATUS_LABELS,
  TOAST_MESSAGES,
} from '@/lib/constants'

export function useKanbanDnd(projectId: string, tasks: Task[]) {
  const queryClient = useQueryClient()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: DND_TOUCH_DELAY,
        tolerance: DND_TOUCH_TOLERANCE,
      },
    }),
  )

  const projectQueryKey = useMemo(() => ['project', projectId], [projectId])

  const moveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: projectQueryKey })
      const previous =
        queryClient.getQueryData<ProjectWithTasks>(projectQueryKey)
      if (previous) {
        queryClient.setQueryData<ProjectWithTasks>(projectQueryKey, {
          ...previous,
          tasks: previous.tasks.map((t) =>
            t.id === id ? { ...t, status } : t,
          ),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectQueryKey, context.previous)
      }
      toast.error(TOAST_MESSAGES.taskMoveFailed)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKey })
    },
  })

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id)
      if (task) setActiveTask(task)
    },
    [tasks],
  )

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null)
      const { active, over } = event
      if (!over) return
      const newStatus = (
        over.data.current as { status?: TaskStatus } | undefined
      )?.status
      const task = (active.data.current as { task?: Task } | undefined)?.task
      if (!task || !newStatus || task.status === newStatus) return
      moveMutation.mutate({ id: task.id, status: newStatus })
    },
    [moveMutation],
  )

  const onDragCancel = useCallback(() => setActiveTask(null), [])

  const announcements = useMemo(
    () => ({
      onDragStart({ active }: { active: { id: string | number } }) {
        const task = tasks.find((t) => t.id === active.id)
        return task
          ? `Picked up task: ${task.title}. Current column: ${STATUS_LABELS[task.status]}.`
          : `Picked up task.`
      },
      onDragOver({
        over,
      }: {
        over: { data: { current?: { status?: TaskStatus } } } | null
      }) {
        const status = over?.data.current?.status
        return status ? `Moved over column: ${STATUS_LABELS[status]}.` : ''
      },
      onDragEnd({
        active,
        over,
      }: {
        active: { id: string | number }
        over: { data: { current?: { status?: TaskStatus } } } | null
      }) {
        const task = tasks.find((t) => t.id === active.id)
        const status = over?.data.current?.status
        if (!task) return ''
        return status
          ? `Dropped task: ${task.title} in column: ${STATUS_LABELS[status]}.`
          : `Dropped task outside any column. Task returned: ${task.title}.`
      },
      onDragCancel({ active }: { active: { id: string | number } }) {
        const task = tasks.find((t) => t.id === active.id)
        return task ? `Drag cancelled. Task: ${task.title}.` : 'Drag cancelled.'
      },
    }),
    [tasks],
  )

  return {
    sensors,
    activeTask,
    announcements,
    onDragStart,
    onDragEnd,
    onDragCancel,
  }
}
