'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, Gem, Trophy, Star, Award, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/store/user'
import { calculateLevel, xpProgressInLevel, xpForNextLevel, BADGE_DEFINITIONS, GEM_COSTS } from '@/lib/gamification'
import { LEAGUE_ORDER, CROWN_EMOJI } from '@/types'
import type { Badge, CrownProgress } from '@/types'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { profile, setProfile, spendGems, refillHearts } = useUserStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [crowns, setCrowns] = useState<CrownProgress[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, badgeRes, crownRes] = await Promise.all([
          fetch('/api/progress'),
          fetch('/api/progress/badges'),
          fetch('/api/progress/crowns'),
        ])
        if (profileRes.ok) setProfile(await profileRes.json())
        if (badgeRes.ok) setBadges(await badgeRes.json())
        if (crownRes.ok) setCrowns(await crownRes.json())
      } catch {}
    }
    load()
  }, [])

  if (!profile) return null

  const level = calculateLevel(profile.xp)
  const completedPages = new Set(crowns.filter((c) => c.completed).map((c) => c.page)).size

  function handleBuyHeartRefill() {
    if (!profile) return
    if (spendGems(GEM_COSTS.heartRefill)) {
      refillHearts()
      const newGems = profile.gems - GEM_COSTS.heartRefill
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gems: newGems, hearts: 5 }),
      })
      toast.success('Hearts refilled!')
    } else {
      toast.error('Not enough gems!')
    }
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Profile header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl font-extrabold text-white">{level}</span>
        </div>
        <h1 className="text-xl font-extrabold text-gray-900">Level {level}</h1>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-sm font-bold text-orange-500">
            <Flame className="w-4 h-4" /> {profile.streak}
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-blue-500">
            <Gem className="w-4 h-4" /> {profile.gems}
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-purple-500">
            <Trophy className="w-4 h-4" /> {profile.league}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total XP', value: profile.xp, color: 'bg-green-50 text-green-700' },
          { label: 'Crowns', value: crowns.filter((c) => c.completed).length, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Pages', value: `${completedPages}/10`, color: 'bg-blue-50 text-blue-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-3 text-center`}>
            <p className="text-2xl font-extrabold">{stat.value}</p>
            <p className="text-xs font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Heart refill */}
      {profile.hearts < 5 && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Refill Hearts</p>
              <p className="text-sm text-gray-500">{GEM_COSTS.heartRefill} gems for full hearts</p>
            </div>
            <button
              onClick={handleBuyHeartRefill}
              className="bg-[#58CC02] text-white font-bold px-4 py-2 rounded-lg text-sm"
            >
              Refill
            </button>
          </div>
        </div>
      )}

      {/* Badges */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Badges</h2>
        <div className="flex flex-wrap gap-2">
          {BADGE_DEFINITIONS.slice(0, 8).map((badge) => {
            const earned = badges.some((b) => b.name === badge.name)
            return (
              <div
                key={badge.name}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  earned
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                }`}
              >
                {earned ? '✅ ' : '🔒 '}
                {badge.name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
