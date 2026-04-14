import { Badge } from '@/components/ui/badge'
import { PRIORITY_CONFIG } from '@/lib/constants'
import type { TaskPriority } from '@/lib/types'

interface PriorityBadgeProps {
  priority: TaskPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]

  return (
    <Badge
      className={config.className}
      aria-label={`Priority: ${config.label}`}
    >
      {config.label}
    </Badge>
  )
}
