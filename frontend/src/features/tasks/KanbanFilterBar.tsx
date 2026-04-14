import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TASK_STATUSES } from '@/lib/types'
import type { TaskStatus, User } from '@/lib/types'
import { STATUS_LABELS, EMPTY_STATES } from '@/lib/constants'
import { Plus, X } from 'lucide-react'

interface KanbanFilterBarProps {
  users: User[]
  statusFilter: TaskStatus | null
  assigneeFilter: string | null
  isFiltered: boolean
  onStatusChange: (status: TaskStatus | null) => void
  onAssigneeChange: (assigneeId: string | null) => void
  onClear: () => void
  onAddTask: () => void
}

export function KanbanFilterBar({
  users,
  statusFilter,
  assigneeFilter,
  isFiltered,
  onStatusChange,
  onAssigneeChange,
  onClear,
  onAddTask,
}: KanbanFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={statusFilter ?? 'all'}
        onValueChange={(val) =>
          onStatusChange(val === 'all' ? null : (val as TaskStatus))
        }
      >
        <SelectTrigger
          className="w-[140px] sm:w-[160px]"
          aria-label="Filter by status"
        >
          <SelectValue>
            {statusFilter ? STATUS_LABELS[statusFilter] : 'All'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {TASK_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={assigneeFilter ?? 'all'}
        onValueChange={(val) => onAssigneeChange(val === 'all' ? null : val)}
      >
        <SelectTrigger
          className="w-[140px] sm:w-[160px]"
          aria-label="Filter by assignee"
        >
          <SelectValue>
            {assigneeFilter
              ? (users.find((u) => u.id === assigneeFilter)?.name ??
                'All assignees')
              : 'All assignees'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isFiltered ? (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-3 w-3" />
          {EMPTY_STATES.filtered.action}
        </Button>
      ) : null}

      <Button size="sm" onClick={onAddTask}>
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  )
}
