import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createProject } from '@/features/projects/projects.api'
import {
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECT_DESCRIPTION_LENGTH,
  TOAST_MESSAGES,
} from '@/lib/constants'
import { Loader2, Plus } from 'lucide-react'

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Project name is required' })
    .max(MAX_PROJECT_NAME_LENGTH),
  description: z.string().max(MAX_PROJECT_DESCRIPTION_LENGTH).optional(),
})

type CreateProjectInput = z.infer<typeof createProjectSchema>

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: CreateProjectInput) =>
      createProject({ name: data.name, description: data.description }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success(TOAST_MESSAGES.projectCreated)
      setOpen(false)
      reset()
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.projectCreateFailed)
    },
  })

  function onSubmit(data: CreateProjectInput) {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              placeholder="Project name"
              maxLength={MAX_PROJECT_NAME_LENGTH}
              aria-invalid={errors.name ? true : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">
              Description{' '}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="project-description"
              placeholder="What is this project about?"
              maxLength={MAX_PROJECT_DESCRIPTION_LENGTH}
              rows={3}
              className="h-24 resize-none overflow-y-auto field-sizing-fixed"
              {...register('description')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
