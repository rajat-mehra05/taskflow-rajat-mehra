import { AVATAR_COLORS } from '@/lib/constants'

export function getInitials(name: string): string {
  const trimmed = name.trim()
  const parts = trimmed.split(/\s+/)
  const first = parts[0]
  const second = parts[1]
  if (first && second) {
    return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase()
  }
  return trimmed.slice(0, 2).toUpperCase()
}

export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index] ?? AVATAR_COLORS[0]
}
