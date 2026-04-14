import { useState, useMemo } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { KanbanColumn } from '@/features/tasks/KanbanColumn'
import { KanbanFilterBar } from '@/features/tasks/KanbanFilterBar'
import { TaskCard } from '@/features/tasks/TaskCard'
import { TaskModal } from '@/features/tasks/TaskModal'
import { useKanbanDnd } from '@/features/tasks/useKanbanDnd'
import { useTaskFilters } from '@/features/tasks/useTaskFilters'
import { useTaskMutations } from '@/features/tasks/useTaskMutations'
import { TASK_STATUSES } from '@/lib/types'
import type { Task, TaskStatus, User } from '@/lib/types'
import { CONFIRM_DELETE_TASK } from '@/lib/constants'

interface KanbanBoardProps {
  projectId: string
  tasks: Task[]
  users: User[]
}

export function KanbanBoard({ projectId, tasks, users }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { statusFilter, assigneeFilter, isFiltered, setFilter, clearFilters } =
    useTaskFilters(users)

  const {
    sensors,
    activeTask,
    announcements,
    onDragStart,
    onDragEnd,
    onDragCancel,
  } = useKanbanDnd(projectId, tasks)

  const { createMutation, updateMutation, deleteMutation } = useTaskMutations({
    projectId,
    onCreated: () => setCreateOpen(false),
    onEdited: () => setSelectedTask(null),
  })

  const tasksByStatus = useMemo(() => {
    const filtered = assigneeFilter
      ? tasks.filter((t) => t.assignee_id === assigneeFilter)
      : tasks
    const map = new Map<TaskStatus, Task[]>()
    for (const status of TASK_STATUSES) {
      map.set(
        status,
        filtered
          .filter((t) => t.status === status)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          ),
      )
    }
    return map
  }, [tasks, assigneeFilter])

  const visibleStatuses = statusFilter
    ? TASK_STATUSES.filter((s) => s === statusFilter)
    : [...TASK_STATUSES]

  const activeAssignee = activeTask
    ? users.find((u) => u.id === activeTask.assignee_id)
    : undefined

  return (
    <div className="space-y-4">
      <KanbanFilterBar
        users={users}
        statusFilter={statusFilter}
        assigneeFilter={assigneeFilter}
        isFiltered={isFiltered}
        onStatusChange={(s) => setFilter('status', s)}
        onAssigneeChange={(a) => setFilter('assignee', a)}
        onClear={clearFilters}
        onAddTask={() => setCreateOpen(true)}
      />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{ announcements }}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 md:overflow-x-visible">
          {visibleStatuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus.get(status) ?? []}
              users={users}
              isFiltered={isFiltered}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              assignee={activeAssignee}
              onClick={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        mode="create"
        projectId={projectId}
        users={users}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
      />

      {selectedTask ? (
        <TaskModal
          mode="edit"
          task={selectedTask}
          users={users}
          open={selectedTask !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedTask(null)
          }}
          onSubmit={(data) =>
            updateMutation.mutate({ id: selectedTask.id, data })
          }
          onDelete={() => {
            if (
              window.confirm(
                CONFIRM_DELETE_TASK.description(selectedTask.title),
              )
            ) {
              deleteMutation.mutate(selectedTask.id)
            }
          }}
          isPending={updateMutation.isPending || deleteMutation.isPending}
        />
      ) : null}
    </div>
  )
}
