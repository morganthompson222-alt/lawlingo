import { NextResponse } from 'next/server'
import { createServerSupabaseAdmin } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const lawcoinAmount = parseInt(session.metadata?.lawcoin_amount || '0', 10)

    if (userId && lawcoinAmount > 0) {
      const supabase = await createServerSupabaseAdmin()

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('lawcoins')
        .eq('id', userId)
        .single()

      const currentLawcoins = profile?.lawcoins || 0

      await supabase
        .from('user_profiles')
        .update({ lawcoins: currentLawcoins + lawcoinAmount })
        .eq('id', userId)
    }
  }

  return NextResponse.json({ received: true })
}
