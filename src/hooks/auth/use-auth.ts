import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase/use-supabase'
import { useState } from 'react'

interface AuthError {
  message: string
}

interface UseAuthReturn {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
  error: AuthError | null
}

export function useAuth(): UseAuthReturn {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await (await supabase).auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (e) {
      setError({ message: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await (await supabase).auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push('/login?message=Check your email to confirm your account')
    } catch (e) {
      setError({ message: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await (await supabase).auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (e) {
      setError({ message: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return {
    signIn,
    signUp,
    signOut,
    loading,
    error,
  }
}