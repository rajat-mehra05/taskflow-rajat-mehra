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

          {/* Desktop: user name + logout */}
          <div className="hidden items-center gap-3 sm:flex">
            <span className="max-w-[150px] truncate text-sm text-muted-foreground">
              {user?.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void handleLogout()}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile: avatar dropdown */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="User menu"
              >
                <UserAvatar name={user?.name ?? null} size="md" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.name}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void handleLogout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
