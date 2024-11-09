// src/hooks/data/index.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import type { Database } from '@/lib/supabase/database.types'

type Tables = Database['public']['Tables']

export function useProjects() {
  return useQuery({
    queryKey: ['projects'] as const,
    queryFn: () => api.projects.getAll()
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id] as const,
    queryFn: () => api.projects.getById(id),
    enabled: !!id
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Tables['projects']['Insert']) => 
      api.projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ['project-tasks', projectId] as const,
    queryFn: () => api.tasks.getByProject(projectId),
    enabled: !!projectId
  })
}