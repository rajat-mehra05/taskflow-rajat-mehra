import { memo, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Circle, Contrast, CircleCheck } from 'lucide-react'
import { TaskCard } from '@/features/tasks/TaskCard'
import {
  STATUS_LABELS,
  STATUS_CONFIG,
  EMPTY_STATES,
  KANBAN_COLUMN_MIN_WIDTH,
} from '@/lib/constants'
import type { Task, TaskStatus, User } from '@/lib/types'

const STATUS_ICONS: Record<TaskStatus, typeof Circle> = {
  todo: Circle,
  in_progress: Contrast,
  done: CircleCheck,
}

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  users: User[]
  isFiltered: boolean
  onTaskClick: (task: Task) => void
}

export const KanbanColumn = memo(function KanbanColumn({
  status,
  tasks,
  users,
  isFiltered,
  onTaskClick,
}: KanbanColumnProps) {
  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status },
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-0 flex-1 flex-col rounded-lg p-3 transition-colors min-h-[calc(100vh-220px)] ${
        isOver
          ? STATUS_CONFIG[status].columnOverClassName
          : STATUS_CONFIG[status].columnClassName
      }`}
      style={{ minWidth: KANBAN_COLUMN_MIN_WIDTH }}
      role="region"
      aria-label={`${STATUS_LABELS[status]} tasks`}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${STATUS_CONFIG[status].className}`}
        >
          {(() => {
            const Icon = STATUS_ICONS[status]
            return <Icon className="size-4" aria-hidden="true" />
          })()}
          {STATUS_LABELS[status]}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {tasks.length}
        </span>
      </div>

      {/* Task list */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto max-h-[calc(100vh-250px)]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={
                task.assignee_id ? userMap.get(task.assignee_id) : undefined
              }
              onClick={() => onTaskClick(task)}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {isFiltered
              ? EMPTY_STATES.filtered.title
              : EMPTY_STATES.column.title}
          </p>
        )}
      </div>
    </div>
  )
})
