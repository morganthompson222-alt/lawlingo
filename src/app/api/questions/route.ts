import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const crown_level = searchParams.get('crown_level')
  const limit = parseInt(searchParams.get('limit') || '8')
  const loophole = searchParams.get('loophole')

  const supabase = await createServerSupabase()

  let query = supabase.from('questions').select('*').limit(limit)

  if (page) query = query.eq('page', page)
  if (crown_level) query = query.eq('crown_level', parseInt(crown_level))
  if (loophole === 'true') query = query.eq('loophole', true)
  if (loophole === 'false') query = query.eq('loophole', false)

  // Random ordering
  query = query.order('id') // stable order, client can shuffle

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Shuffle
  const shuffled = data.sort(() => Math.random() - 0.5)

  return NextResponse.json(shuffled)
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  const body = await request.json()

  const { data, error } = await supabase
    .from('questions')
    .insert(body)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
