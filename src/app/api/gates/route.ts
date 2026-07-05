import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const crown_level = searchParams.get('crown_level')

  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if user has completed all lessons for this crown
  const { data: attempts } = await supabase
    .from('lesson_attempts')
    .select('*')
    .eq('user_id', user.id)
    .like('lesson_id', `${page}-crown${crown_level}-%`)

  const allComplete = (attempts?.length ?? 0) >= 3 // at least 3 lessons completed

  if (!allComplete) {
    return NextResponse.json({ error: 'Complete all lessons first' }, { status: 403 })
  }

  // Pull 15 random questions from pool
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('page', page)
    .eq('crown_level', parseInt(crown_level!))
    .limit(50)

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'No questions available' }, { status: 404 })
  }

  // Enforce loophole requirements (min 20% for Crown 1-2, 25% for 3-4, 33% for 5)
  const level = parseInt(crown_level!)
  const loopholeRatio = level >= 5 ? 0.33 : level >= 3 ? 0.25 : 0.2
  const totalQuestions = 15
  const minLoopholes = Math.ceil(totalQuestions * loopholeRatio)

  const loopholes = questions.filter((q) => q.loophole)
  const regular = questions.filter((q) => !q.loophole)

  const selectedLoopholes = loopholes.sort(() => Math.random() - 0.5).slice(0, minLoopholes)
  const selectedRegular = regular
    .sort(() => Math.random() - 0.5)
    .slice(0, totalQuestions - selectedLoopholes.length)

  const allSelected = [...selectedLoopholes, ...selectedRegular].sort(() => Math.random() - 0.5)

  return NextResponse.json({
    gateId: `${page}-${crown_level}-${Date.now()}`,
    questions: allSelected.slice(0, totalQuestions),
  })
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { page, crown_level, score, passed } = body

  const { data, error } = await supabase
    .from('gate_attempts')
    .insert({
      user_id: user.id,
      page,
      crown_level,
      score,
      passed,
    })
    .select()
    .single()

  if (passed) {
    await supabase.from('crown_progress').upsert({
      user_id: user.id,
      page,
      crown_level,
      completed: true,
      completed_at: new Date().toISOString(),
    })
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
