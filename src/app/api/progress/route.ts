import { NextResponse } from 'next/server'
import { createServerSupabase, createServerSupabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Regenerate hearts
  const adminClient = await createServerSupabaseAdmin()
  await adminClient.rpc('regenerate_hearts', { p_user_id: user.id })

  const { data: refreshed } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json(refreshed || data)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { xp, gems, streak, hearts } = body

  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (xp !== undefined) updates.xp = xp
  if (gems !== undefined) updates.gems = gems
  if (streak !== undefined) updates.streak = streak
  if (hearts !== undefined) updates.hearts = hearts

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
