import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')
  const microSkill = searchParams.get('microSkill')

  if (!lessonId && !microSkill) {
    return NextResponse.json({ error: 'lessonId or microSkill required' }, { status: 400 })
  }

  const supabase = await createServerSupabase()

  let query = supabase.from('questions').select('*')

  if (lessonId) query = query.eq('lesson_id', lessonId)
  if (microSkill) query = query.eq('micro_skill', microSkill)

  query = query.order('block').order('phase').order('created_at')

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group by blocks for client rendering
  const questions = (data ?? []).map(q => ({
    id: q.id,
    lessonId: q.lesson_id,
    microSkill: q.micro_skill,
    block: q.block,
    phase: q.phase,
    teachingSummary: q.teaching_summary,
    type: q.type,
    question: q.question,
    answer: q.answer,
    options: q.options,
    feedback: q.feedback,
    oscoaReferences: q.oscoa_references,
    difficulty: q.difficulty,
    tags: q.tags,
  }))

  // Split teaching blocks from consolidation
  const teaching = questions.filter(q => q.phase === 'teaching')
  const consolidation = questions.filter(q => q.phase === 'consolidation')

  // Ensure options is always an array (not a string)
  const ensureArray = (opts: any) => {
    if (Array.isArray(opts)) return opts
    if (typeof opts === 'string') {
      try { return JSON.parse(opts) } catch { return [] }
    }
    return []
  }

  return NextResponse.json({
    lessonId: teaching[0]?.lessonId || lessonId,
    microSkill: teaching[0]?.microSkill || microSkill,
    blocks: ['A', 'B', 'C'].map(b => ({
      block: b,
      teaching: teaching.find(q => q.block === b && q.type === 'teaching'),
      questions: teaching.filter(q => q.block === b && q.type !== 'teaching').map(q => ({ ...q, options: ensureArray(q.options) })),
    })),
    consolidation: {
      questions: consolidation.map(q => ({ ...q, options: ensureArray(q.options) })),
    },
  })
}
