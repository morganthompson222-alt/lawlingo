import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabase()

  // Get top 20 players for the current week
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const { data } = await supabase
    .from('leaderboard')
    .select('*, user_profiles!inner(xp, streak)')
    .eq('week_start', weekStart.toISOString().split('T')[0])
    .order('weekly_xp', { ascending: false })
    .limit(20)

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { xp_amount } = body

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekKey = weekStart.toISOString().split('T')[0]

  // Get existing record
  const { data: existing } = await supabase
    .from('leaderboard')
    .select('weekly_xp')
    .eq('user_id', user.id)
    .eq('week_start', weekKey)
    .single()

  const currentXP = existing?.weekly_xp ?? 0
  const newXP = currentXP + xp_amount

  const { data, error } = await supabase
    .from('leaderboard')
    .upsert({
      user_id: user.id,
      week_start: weekKey,
      weekly_xp: newXP,
      league: 'bronze',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
