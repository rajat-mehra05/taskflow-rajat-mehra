import { useSearchParams } from 'react-router-dom'
import { TASK_STATUSES } from '@/lib/types'
import type { TaskStatus, User } from '@/lib/types'

export function useTaskFilters(users: User[]) {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawStatus = searchParams.get('status')
  const statusFilter: TaskStatus | null =
    rawStatus && (TASK_STATUSES as readonly string[]).includes(rawStatus)
      ? (rawStatus as TaskStatus)
      : null

  const rawAssignee = searchParams.get('assignee')
  const assigneeFilter =
    rawAssignee && users.some((u) => u.id === rawAssignee) ? rawAssignee : null

  const isFiltered = statusFilter !== null || assigneeFilter !== null

  function setFilter(key: 'status' | 'assignee', value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }

  function clearFilters() {
    setSearchParams({})
  }

  return { statusFilter, assigneeFilter, isFiltered, setFilter, clearFilters }
}
