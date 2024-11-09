// src/app/api/auth/sign-in/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  const { error } = await (await supabase).auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.redirect(
      `${new URL(request.url).origin}/login?error=Invalid credentials`,
      {
        status: 301,
      }
    )
  }

  return NextResponse.redirect(new URL(request.url).origin, {
    status: 301,
  })
}