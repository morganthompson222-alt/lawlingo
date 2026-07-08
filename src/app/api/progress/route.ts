import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get or create user profile
  let { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If profile doesn't exist (edge case), create it manually
  if (!profile) {
    const { data: newProfile } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        xp: 0,
        gems: 500,
        streak: 0,
        league: 'bronze',
        hearts: 5,
      })
      .select()
      .single()
    profile = newProfile

    // Also create loopholes access and leaderboard entries
    await supabase.from('loopholes_access').insert({ user_id: user.id, passed: false, pledged: false })
    await supabase.from('leaderboard').insert({
      user_id: user.id,
      league: 'bronze',
      weekly_xp: 0,
      week_start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0],
    })
  }

  // Update streak
  const today = new Date().toISOString().split('T')[0]
  const lastActive = profile.last_active ? new Date(profile.last_active).toISOString().split('T')[0] : null
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  let newStreak = profile.streak
  if (lastActive !== today) {
    if (lastActive === yesterday) {
      newStreak = profile.streak + 1
    } else if (lastActive !== today) {
      newStreak = 1
    }
    await supabase
      .from('user_profiles')
      .update({ streak: newStreak, last_active: new Date().toISOString() })
      .eq('id', user.id)
  }

  profile = { ...profile, streak: newStreak }
  return NextResponse.json(profile)
}
