import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate, getDueDateStatus } from '@/lib/utils/date'
import { cn } from '@/lib/utils'

interface DueDateLabelProps {
  dueDate: string | null
}

const DATE_STYLES = {
  overdue: 'text-destructive',
  today: 'text-amber-600 dark:text-amber-400',
  upcoming: 'text-muted-foreground',
} as const

const STATUS_BADGE = {
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive' },
  today: {
    label: 'Due today',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
  upcoming: null,
} as const

export function DueDateLabel({ dueDate }: DueDateLabelProps) {
  if (!dueDate) return null

  const status = getDueDateStatus(dueDate)
  if (!status) return null

  const badge = STATUS_BADGE[status]

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className={cn('flex items-center gap-1 text-xs', DATE_STYLES[status])}
      >
        <Calendar className="h-3 w-3" />
        <span>{formatDate(dueDate)}</span>
      </div>
      {badge ? (
        <Badge className={cn('border-transparent', badge.className)}>
          {badge.label}
        </Badge>
      ) : null}
    </div>
  )
}
