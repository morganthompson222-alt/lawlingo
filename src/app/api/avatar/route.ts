import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { DEFAULT_AVATAR_CONFIG } from '@/types'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('avatar_config')
    .eq('id', user.id)
    .single()

  const config = profile?.avatar_config || DEFAULT_AVATAR_CONFIG
  return NextResponse.json({ config })
}

export async function PUT(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { config } = await req.json()

  const { error } = await supabase
    .from('user_profiles')
    .update({ avatar_config: config })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, config })
}
