import { create } from 'zustand'
import { createClient } from '@/lib/supabase/config'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: Error | null
  checkUser: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  
  checkUser: async () => {
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          
        set({ user, profile, loading: false })
      } else {
        set({ user: null, profile: null, loading: false })
      }
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      await get().checkUser()
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  },
  
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      set({ loading: false })
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  },
  
  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
  
  updateProfile: async (data) => {
    try {
      set({ loading: true, error: null })
      const supabase = createClient()
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', get().user?.id ?? '')
      
      if (error) throw error
      
      await get().checkUser()
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  }
}))