import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { LAWCOIN_PACKAGES } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { packageId } = await req.json()
  const pkg = LAWCOIN_PACKAGES.find((p) => p.id === packageId)

  if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${pkg.amount} LawCoins — ${pkg.name}`,
            description: `Purchase ${pkg.amount} LawCoins for LawLingo avatar shop`,
          },
          unit_amount: Math.round(pkg.price_usd * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      package_id: packageId,
      lawcoin_amount: pkg.amount.toString(),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop?purchase=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop?purchase=cancelled`,
  })

  return NextResponse.json({ url: session.url })
}
