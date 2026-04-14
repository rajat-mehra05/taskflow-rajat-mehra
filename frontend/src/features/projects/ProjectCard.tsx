import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Project } from '@/lib/types'
import { formatFullDate } from '@/lib/utils/date'

interface ProjectCardProps {
  project: Project
  taskCount?: number
}

export function ProjectCard({ project, taskCount }: ProjectCardProps) {
  const navigate = useNavigate()

  const open = () => void navigate(`/projects/${project.id}`)

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={project.name}
    >
      <CardHeader>
        <CardTitle className="truncate">{project.name}</CardTitle>
        {project.description ? (
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {taskCount !== undefined ? `${taskCount} tasks` : null}
          {taskCount !== undefined ? ' · ' : null}
          Created {formatFullDate(project.created_at)}
        </p>
      </CardContent>
    </Card>
  )
}
