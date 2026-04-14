import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useTheme } from '@/lib/hooks/useTheme'
import { UserAvatar } from '@/components/layout/UserAvatar'
import { APP_NAME, CONTENT_MAX_WIDTH } from '@/lib/constants'

export function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    void navigate('/login', { replace: true })
  }

  return (
    <header className="border-b bg-background">
      <nav
        className={`mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 ${CONTENT_MAX_WIDTH}`}
      >
        <Link to="/projects" className="text-lg font-bold sm:text-xl">
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={user?.name ? `${user.name} — open user menu` : 'User menu'}
            >
              <UserAvatar name={user?.name ?? null} size="md" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                {user?.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => void handleLogout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  )
}
