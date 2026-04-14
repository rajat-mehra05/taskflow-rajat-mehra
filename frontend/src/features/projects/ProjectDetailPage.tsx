import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getProject, deleteProject } from '@/features/projects/projects.api'
import { KanbanBoard } from '@/features/tasks/KanbanBoard'
import { useAuth } from '@/features/auth/AuthContext'
import { seedUsers } from '@/mocks/data'
import {
  TOAST_MESSAGES,
  CONFIRM_DELETE_PROJECT,
  EMPTY_STATES,
} from '@/lib/constants'
import { AlertCircle, ArrowLeft, Loader2, Trash2 } from 'lucide-react'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id ?? ''),
    enabled: Boolean(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(id ?? ''),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success(TOAST_MESSAGES.projectDeleted)
      void navigate('/projects', { replace: true })
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.projectDeleteFailed)
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 w-60 shrink-0 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-medium">
          {EMPTY_STATES.projectNotFound.title}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => void (isError ? refetch() : navigate('/projects'))}
        >
          {isError ? 'Try again' : EMPTY_STATES.projectNotFound.action}
        </Button>
      </div>
    )
  }

  const isOwner = currentUser?.id === project.owner_id

  const projectName = project.name

  function handleDelete() {
    if (!id) return
    if (window.confirm(CONFIRM_DELETE_PROJECT.description(projectName))) {
      deleteMutation.mutate()
    }
  }

  // Use seed users for now — in production, fetch from API
  const users = seedUsers.map(({ password: _, ...u }) => u)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold sm:text-2xl">{project.name}</h1>
          {project.description ? (
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {project.description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => void navigate('/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            onClick={() => void navigate('/projects')}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {isOwner ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Delete Project</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Kanban board */}
      <KanbanBoard projectId={project.id} tasks={project.tasks} users={users} />
    </div>
  )
}
