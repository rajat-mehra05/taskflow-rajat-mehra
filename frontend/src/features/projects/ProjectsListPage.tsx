import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/features/projects/projects.api'
import { ProjectCard } from '@/features/projects/ProjectCard'
import { CreateProjectDialog } from '@/features/projects/CreateProjectDialog'
import { Button } from '@/components/ui/button'
import { EMPTY_STATES } from '@/lib/constants'
import { AlertCircle, FolderOpen } from 'lucide-react'

export function ProjectsListPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-medium">Failed to load projects</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => void refetch()}
        >
          Try again
        </Button>
      </div>
    )
  }

  const projects = data?.projects ?? []

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">
            {EMPTY_STATES.projects.title}
          </p>
          <div className="mt-4">
            <CreateProjectDialog />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProjectDialog />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
