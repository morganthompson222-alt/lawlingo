import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { calculateSM2 } from '@/lib/spaced-repetition/sm2'

export async function GET() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('review_cards')
    .select('*')
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())
    .order('next_review', { ascending: true })
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
  const { micro_skill, quality } = body

  // Get existing card or use defaults
  const { data: existing } = await supabase
    .from('review_cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('micro_skill', micro_skill)
    .single()

  const easiness = existing?.easiness ?? 2.5
  const interval = existing?.interval ?? 0

  const result = calculateSM2(easiness, interval, quality)

  const { data, error } = await supabase
    .from('review_cards')
    .upsert({
      user_id: user.id,
      micro_skill,
      easiness: result.easiness,
      interval: result.interval,
      next_review: result.nextReview.toISOString(),
      last_review: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
