import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { subscription },
      } = (await supabase).auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        router.refresh()
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    fetchData()
  }, [router, supabase])

  return {
    user,
    loading,
    supabase,
  }
}