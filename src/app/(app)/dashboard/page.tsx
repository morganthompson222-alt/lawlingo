'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Flame, Trophy, Star, ArrowRight, BookOpen, Brain, Target } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/store/user'
import { calculateLevel, xpProgressInLevel, xpForNextLevel } from '@/lib/gamification'
import type { ReviewCard, CrownProgress } from '@/types'
import { PAGE_NAMES, PAGE_EMOJI, CROWN_EMOJI } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { profile, setProfile, crowns } = useUserStore()
  const [reviews, setReviews] = useState<ReviewCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          fetch('/api/progress'),
          fetch('/api/reviews'),
        ])
        if (profileRes.ok) setProfile(await profileRes.json())
        if (reviewsRes.ok) setReviews(await reviewsRes.json())
      } catch {}
      setLoading(false)
    }
    if (!profile) load()
    else {
      setLoading(false)
      fetch('/api/reviews').then(async (r) => { if (r.ok) setReviews(await r.json()) })
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4">
          <div className="w-32 h-8 bg-gray-200 rounded mx-auto" />
          <div className="w-64 h-4 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Welcome to LawLingo</h1>
          <p className="text-gray-500 mb-6">Log in to start learning</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#58CC02] text-white font-bold py-3 px-8 rounded-xl"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  const level = calculateLevel(profile.xp)
  const progressXP = xpProgressInLevel(profile.xp)
  const nextLevelXP = xpForNextLevel(profile.xp)
  const progressPercent = (progressXP / nextLevelXP) * 100

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Greeting + streak */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">LawLingo</h1>
          <p className="text-sm text-gray-500">Continue your legal mastery</p>
        </div>
        <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600">{profile.streak}</span>
        </div>
      </div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Level {level}</p>
              <p className="text-lg font-bold">{profile.xp} XP</p>
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Next level: {nextLevelXP} XP</p>
      </motion.div>

      {/* Practice button if reviews due */}
      {reviews.length > 0 && (
        <Link
          href="/practice"
          className="block bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-amber-600" />
            <div className="flex-1">
              <p className="font-bold text-amber-900">Review Due!</p>
              <p className="text-sm text-amber-700">{reviews.length} topics need practice</p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-600" />
          </div>
        </Link>
      )}

      {/* Skill Tree shortcut */}
      <Link
        href="/skill-tree"
        className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">Skill Tree</p>
            <p className="text-sm text-gray-500">Continue your legal education</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300" />
        </div>
      </Link>

      {/* Quick access: recently studied */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Continue Learning</h2>
        <div className="space-y-2">
          {Object.entries(PAGE_NAMES).slice(0, 4).map(([key, name]) => (
            <button
              key={key}
              onClick={() => router.push(`/learn/${key}`)}
              className="w-full bg-white rounded-xl p-4 border border-gray-100 text-left hover:border-green-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PAGE_EMOJI[key]}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
