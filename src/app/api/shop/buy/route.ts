import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { item_id, currency } = await req.json()

  if (!item_id || !['gems', 'lawcoins'].includes(currency)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
  }

  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('id', item_id)
    .single()

  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  const { data: existing } = await supabase
    .from('user_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', item_id)
    .single()

  if (existing) return NextResponse.json({ error: 'Already owned' }, { status: 409 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('gems, lawcoins')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const price = currency === 'gems' ? item.price_gems : item.price_lawcoins
  if (price <= 0) return NextResponse.json({ error: 'This item cannot be purchased with this currency' }, { status: 400 })

  const balance = currency === 'gems' ? profile.gems : (profile.lawcoins || 0)
  if (balance < price) return NextResponse.json({ error: 'Insufficient funds' }, { status: 402 })

  const updateField = currency === 'gems' ? 'gems' : 'lawcoins'
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ [updateField]: balance - price })
    .eq('id', user.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  const { error: insertError } = await supabase
    .from('user_items')
    .insert({ user_id: user.id, item_id })

  if (insertError) {
    await supabase
      .from('user_profiles')
      .update({ [updateField]: balance })
      .eq('id', user.id)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    new_balance: balance - price,
    currency,
    item,
  })
}
