export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export type DueDateStatus = 'overdue' | 'today' | 'upcoming' | null

export function getDueDateStatus(dateString: string | null): DueDateStatus {
  if (!dateString) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(dateString)
  dueDate.setHours(0, 0, 0, 0)

  if (dueDate < today) return 'overdue'
  if (dueDate.getTime() === today.getTime()) return 'today'
  return 'upcoming'
}
