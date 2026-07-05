import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // If Supabase env vars not configured, allow all requests
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: '', ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  try {
    const { data: { user } } = await supabase.auth.getUser()

    const protectedPaths = ['/dashboard', '/learn', '/story', '/practice', '/profile', '/skill-tree']
    const isProtected = protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))

    if (!user && isProtected) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch {
    // Auth check failed — allow request to proceed (page-level auth will handle)
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/story/:path*',
    '/practice/:path*',
    '/profile/:path*',
    '/skill-tree/:path*',
    '/login',
  ],
}
