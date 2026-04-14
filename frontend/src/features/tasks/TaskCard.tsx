import { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { UserAvatar } from '@/components/layout/UserAvatar'
import { PriorityBadge } from '@/features/tasks/PriorityBadge'
import { DueDateLabel } from '@/features/tasks/DueDateLabel'
import type { Task, User } from '@/lib/types'

interface TaskCardProps {
  task: Task
  assignee: User | undefined
  onClick: () => void
  isOverlay?: boolean
}

export const TaskCard = memo(function TaskCard({
  task,
  assignee,
  onClick,
  isOverlay = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { task }, disabled: isOverlay })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging && !isOverlay ? 0.4 : 1,
    cursor: isOverlay ? 'grabbing' : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="min-w-0 cursor-grab touch-pan-y overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:cursor-grabbing"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={task.title}
      aria-roledescription="draggable task"
    >
      {/* Title */}
      <p className="line-clamp-2 text-base font-medium leading-snug">
        {task.title}
      </p>

      {/* Description — single line, truncated to keep cards compact */}
      {task.description ? (
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {task.description}
        </p>
      ) : null}

      {/* Priority + Assignee row */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-1.5 overflow-hidden">
          <UserAvatar name={assignee?.name ?? null} size="sm" />
          <span className="max-w-[100px] truncate text-sm text-muted-foreground">
            {assignee?.name ?? 'Unassigned'}
          </span>
        </div>
      </div>

      {/* Due date */}
      {task.due_date ? (
        <div className="mt-2">
          <DueDateLabel dueDate={task.due_date} />
        </div>
      ) : null}
    </div>
  )
})
