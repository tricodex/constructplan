// src/app/api/auth/signout/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createClient()

  // Clear auth data
  const { error } = await (await supabase).auth.signOut()

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/error?message=Could not sign out`,
      {
        status: 301,
      }
    )
  }

  // Clear cookies and redirect
  const response = NextResponse.redirect(`${requestUrl.origin}/login`, {
    status: 301,
  });
  
  response.cookies.delete('sb-access-token');
  response.cookies.delete('sb-refresh-token');

  return response;
}