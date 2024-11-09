// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)

  // Skip middleware for public routes and static files
  if (
    requestUrl.pathname === '/' ||
    requestUrl.pathname === '/login' ||
    requestUrl.pathname === '/signup' ||
    requestUrl.pathname.startsWith('/auth/') ||
    requestUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const cookieStore = await request.cookies
          return cookieStore.get(name)?.value
        },
        set: async (name: string, value: string, options: CookieOptions) => {
          const cookieStore = await response.cookies
          cookieStore.set(name, value, options)
        },
        remove: async (name: string) => {
          const cookieStore = await response.cookies
          cookieStore.delete(name)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
