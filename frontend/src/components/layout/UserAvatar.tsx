import { User } from 'lucide-react'
import { getInitials, getAvatarColor } from '@/lib/utils/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name: string | null
  size?: 'sm' | 'md'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-8 w-8 text-sm',
} as const

export function UserAvatar({ name, size = 'sm', className }: UserAvatarProps) {
  if (!name) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-muted',
          SIZE_CLASSES[size],
          className,
        )}
      >
        <User className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-medium text-white',
        getAvatarColor(name),
        SIZE_CLASSES[size],
        className,
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
