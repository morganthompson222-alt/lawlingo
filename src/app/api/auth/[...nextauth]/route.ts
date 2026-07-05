import { NextRequest } from 'next/server'

// For Next.js 16 compatibility, we use Supabase auth directly in the login page
// and pass the session cookie. The next-auth package has some compatibility issues
// with Next.js 16 App Router. We handle auth via Supabase client directly.
//
// This route file exists as a placeholder. Auth is handled client-side
// via @supabase/supabase-js in the login page.

export async function GET() {
  return Response.json({ message: 'Auth endpoint — use Supabase client directly' })
}

export async function POST() {
  return Response.json({ message: 'Auth endpoint — use Supabase client directly' })
}
