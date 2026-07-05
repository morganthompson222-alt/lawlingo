'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Question, ReviewCard } from '@/types'
import LessonPlayer from '@/components/lesson/LessonPlayer'
import LessonResult from '@/components/lesson/LessonResult'
import { calculateLessonXP } from '@/lib/gamification'
import { useUserStore } from '@/store/user'

export default function PracticePage() {
  const router = useRouter()
  const { profile, addXP, addGems } = useUserStore()
  const [reviews, setReviews] = useState<ReviewCard[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'results'>('idle')
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) setReviews(await res.json())
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  async function startPractice() {
    if (reviews.length === 0) return

    setLoading(true)
    const microSkills = reviews.slice(0, 3).map((r) => r.micro_skill)
    
    try {
      const res = await fetch(`/api/questions?limit=10&loophole=false`)
      if (res.ok) {
        const data = await res.json()
        // Filter to relevant micro-skills or use all
        const relevant = data.filter((q: Question) => microSkills.includes(q.micro_skill))
        setQuestions(relevant.length >= 5 ? relevant.slice(0, 8) : data.slice(0, 8))
      }
    } catch {}
    setLoading(false)
    setPhase('playing')
  }

  async function handleComplete(r: { correct: number; total: number; mistakes: string[] }) {
    const xp = calculateLessonXP(profile?.streak ?? 0, 60)
    setResults({ ...r, xpEarned: xp.total, gemsEarned: 5 })
    addXP(xp.total)
    addGems(5)
    setPhase('results')

    // Update review cards with quality scores
    for (const microSkill of r.mistakes) {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ micro_skill: microSkill, quality: 1 }),
      })
    }
  }

  return (
    <div>
      {phase === 'idle' && (
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900">Practice Hub</h1>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-10 h-10 text-amber-600" />
                  <div>
                    <p className="font-bold text-amber-900 text-lg">{reviews.length} Topics to Review</p>
                    <p className="text-sm text-amber-700">Spaced repetition is ready</p>
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  {reviews.slice(0, 5).map((r) => (
                    <p key={r.id} className="text-sm text-amber-800">• {r.micro_skill}</p>
                  ))}
                  {reviews.length > 5 && (
                    <p className="text-xs text-amber-600">...and {reviews.length - 5} more</p>
                  )}
                </div>
                <button
                  onClick={startPractice}
                  className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  Start Practice <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-500 mb-2">All Caught Up!</h2>
              <p className="text-gray-400">No reviews due. Keep learning to build your review queue.</p>
              <button
                onClick={() => router.push('/skill-tree')}
                className="mt-6 bg-[#58CC02] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#46A302] transition-colors"
              >
                Go to Skill Tree
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'playing' && questions.length > 0 && (
        <LessonPlayer
          questions={questions}
          onComplete={handleComplete}
          onExit={() => setPhase('idle')}
        />
      )}

      {phase === 'results' && results && (
        <LessonResult
          correct={results.correct}
          total={results.total}
          xpEarned={results.xpEarned}
          gemsEarned={results.gemsEarned}
          mistakes={results.mistakes}
          onRetry={() => setPhase('idle')}
          onContinue={() => { setPhase('idle'); router.push('/dashboard') }}
        />
      )}
    </div>
  )
}
