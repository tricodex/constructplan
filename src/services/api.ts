// src/services/api.ts
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'
import { TABLES } from '@/lib/supabase/schema'
import type { Json } from '@/lib/supabase/database.types'

type Tables = Database['public']['Tables']

export const api = {
  projects: {
    async getAll() {
      const supabase = createClient()
      return (await supabase)
        .from(TABLES.PROJECTS)
        .select(`
          *,
          tasks:${TABLES.TASKS}(count),
          timeline:${TABLES.PROJECT_TIMELINES}(
            id,
            phases,
            estimates
          ),
          team:${TABLES.PROFILES}(
            id,
            full_name,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false })
    },

    async getById(id: string) {
      const supabase = createClient()
      return (await supabase)
        .from(TABLES.PROJECTS)
        .select(`
          *,
          tasks:${TABLES.TASKS}(*),
          timeline:${TABLES.PROJECT_TIMELINES}(*),
          documents:${TABLES.DOCUMENTS}(*),
          insights:${TABLES.PROJECT_INSIGHTS}(*),
          team:${TABLES.PROFILES}(*)
        `)
        .eq('id', id)
        .single()
    },

    async create(data: Tables['projects']['Insert']) {
      const supabase = createClient()
      return (await supabase)
        .from(TABLES.PROJECTS)
        .insert(data)
        .select()
        .single()
    }
  },

  tasks: {
    async getByProject(projectId: string) {
      const supabase = createClient()
      return (await supabase)
        .from(TABLES.TASKS)
        .select(`
          *,
          assignee:${TABLES.PROFILES}(*),
          project:${TABLES.PROJECTS}(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
    },

    async create(data: Tables['tasks']['Insert']) {
      const supabase = createClient()
      return (await supabase)
        .from(TABLES.TASKS)
        .insert(data)
        .select()
        .single()
    }
  },

  photos: {
    async analyze(projectId: string, photoUrl: string) {
      const supabase = createClient()
      const analysis_result: Json = {
        status: 'pending',
        timestamp: new Date().toISOString(),
      }
      
      return (await supabase)
        .from(TABLES.PHOTO_ANALYSES)
        .insert({
          project_id: projectId,
          photo_url: photoUrl,
          analysis_result,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()
    }
  }
}