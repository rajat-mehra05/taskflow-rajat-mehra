import { Calendar } from 'lucide-react'
import { formatDate, getDueDateStatus } from '@/lib/utils/date'
import { cn } from '@/lib/utils'

interface DueDateLabelProps {
  dueDate: string | null
}

const STATUS_STYLES = {
  overdue: 'text-destructive',
  today: 'text-amber-600 dark:text-amber-400',
  upcoming: 'text-muted-foreground',
} as const

const STATUS_TEXT = {
  overdue: 'Overdue',
  today: 'Due today',
  upcoming: null,
} as const

export function DueDateLabel({ dueDate }: DueDateLabelProps) {
  if (!dueDate) return null

  const status = getDueDateStatus(dueDate)
  if (!status) return null

  return (
    <div
      className={cn('flex items-center gap-1 text-xs', STATUS_STYLES[status])}
    >
      <Calendar className="h-3 w-3" />
      <span>{formatDate(dueDate)}</span>
      {STATUS_TEXT[status] ? (
        <span className="font-medium">{STATUS_TEXT[status]}</span>
      ) : null}
    </div>
  )
}
