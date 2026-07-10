import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

// CROWN_LEVEL_MAP: maps micro-skill to its crown level for progression
function getCrownLevel(microSkill: string): number {
  const section = microSkill?.match(/^[A-J](\d+)/)
  if (!section) return 1
  const num = parseInt(section[1])
  if (num <= 3) return 1
  if (num <= 6) return 2
  if (num <= 10) return 3
  if (num <= 17) return 4
  return 5
}

export async function GET(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')

  if (!lessonId) {
    // Return all completions for the user (used by skill tree)
    const { data: completions } = await supabase
      .from('lesson_completions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    const { data: saves } = await supabase
      .from('lesson_save_states')
      .select('*')
      .eq('user_id', user.id)

    return NextResponse.json({ completions: completions || [], saveStates: saves || [] })
  }

  // Return save state for a specific lesson
  const { data: saveState } = await supabase
    .from('lesson_save_states')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  const { data: completion } = await supabase
    .from('lesson_completions')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  return NextResponse.json({ saveState: saveState || null, completion: completion || null })
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { lessonId, microSkill, state } = body

  // Save lesson state for resume
  if (state) {
    const { error } = await supabase
      .from('lesson_save_states')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        micro_skill: microSkill || '',
        state,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ saved: true })
  }

  return NextResponse.json({ error: 'No state or completion data provided' }, { status: 400 })
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { lessonId, microSkill, correct, total, mistakes, complete } = body

  if (complete) {
    const page = lessonId?.match(/lesson-([A-J])/)?.[1] || ''
    const crownLevel = getCrownLevel(microSkill || '')
    const score = total > 0 ? correct / total : 0

    // Record completion
    const { error: compErr } = await supabase
      .from('lesson_completions')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        micro_skill: microSkill || '',
        page,
        crown_level: crownLevel,
        score,
        correct: correct || 0,
        total: total || 0,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' })

    if (compErr) return NextResponse.json({ error: compErr.message }, { status: 500 })

    // Delete save state (lesson finished)
    await supabase
      .from('lesson_save_states')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    // Award crown: if user has completed enough lessons for this crown level
    const { data: completions } = await supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('page', page)
      .eq('crown_level', crownLevel)

    const completedCount = completions?.length || 0
    // Unlock crown after completing the first lesson at that level
    if (completedCount >= 1) {
      const { error: crownErr } = await supabase
        .from('crown_progress')
        .upsert({
          user_id: user.id,
          page,
          level: crownLevel,
          completed: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,page,level' })

      if (crownErr) console.error('Crown upsert error:', crownErr.message)
    }

    return NextResponse.json({
      completed: true,
      crownLevel,
      page,
      completions: completions?.length || 0,
    })
  }

  return NextResponse.json({ error: 'Missing completion data' }, { status: 400 })
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')

  if (lessonId) {
    await supabase
      .from('lesson_save_states')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    return NextResponse.json({ deleted: true })
  }

  return NextResponse.json({ error: 'lessonId required' }, { status: 400 })
}
