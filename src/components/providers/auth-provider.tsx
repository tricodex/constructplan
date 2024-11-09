'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { usePathname, useRouter } from 'next/navigation'

const publicRoutes = ['/', '/login', '/signup', '/auth/callback']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkUser, user, loading } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Only check user on protected routes
    if (!publicRoutes.includes(pathname)) {
      checkUser()
    }
  }, [checkUser, pathname])

  useEffect(() => {
    if (!loading) {
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!user && !isPublicRoute) {
        router.push('/login')
      } else if (user && pathname === '/login') {
        router.push('/dashboard')
      }
    }
  }, [user, loading, pathname, router])

  if (loading && !publicRoutes.includes(pathname)) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
