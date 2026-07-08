'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Play } from 'lucide-react'
import LessonPlayer from '@/components/lesson/LessonPlayer'
import LessonResult from '@/components/lesson/LessonResult'
import type { Question } from '@/types'
import { CROWN_EMOJI, CROWN_NAMES } from '@/types'
import { calculateLessonXP } from '@/lib/gamification'
import { useUserStore } from '@/store/user'

interface PageParams {
  params: { page: string }
}

function LearnPageContent({ page }: { page: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { profile, addXP, addGems } = useUserStore()

  const crownParam = searchParams.get('crown')
  const [crownLevel, setCrownLevel] = useState<number>(crownParam ? parseInt(crownParam) : 1)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<'select' | 'playing' | 'results'>('select')
  const [results, setResults] = useState<{
    correct: number
    total: number
    mistakes: string[]
    xpEarned: number
    gemsEarned: number
  } | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/questions?page=${page}&crown_level=${crownLevel}&limit=8`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setQuestions(data)
          } else {
            setError('Received invalid data')
          }
        } else {
          setError('Failed to load questions')
        }
      } catch (e) {
        setError('Could not connect to server')
      }
      setLoading(false)
    }
    load()
  }, [page, crownLevel])

  function startLesson() {
    if (questions.length === 0) return
    setPhase('playing')
  }

  async function handleComplete(r: { correct: number; total: number; mistakes: string[] }) {
    const xp = calculateLessonXP(profile?.streak ?? 0, 60)
    const gems = r.correct >= Math.ceil(r.total * 0.7) ? 10 : 3

    setResults({ ...r, xpEarned: xp.total, gemsEarned: gems })
    addXP(xp.total)
    addGems(gems)
    setPhase('results')

    await fetch('/api/progress/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: `${page}-crown${crownLevel}-lesson`,
        score: Math.round((r.correct / r.total) * 100),
        mistakes: r.mistakes,
      }),
    })
  }

  return (
    <div>
      {phase === 'select' && (
        <div className="px-4 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-5xl mb-4">{CROWN_EMOJI[crownLevel]}</div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {CROWN_NAMES[crownLevel]} Crown
            </h1>
            <p className="text-gray-500 mb-6">Page {page} — Crown Level {crownLevel}</p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => { setCrownLevel(level); setQuestions([]) }}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    level === crownLevel
                      ? 'bg-green-100 ring-2 ring-green-500 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {CROWN_EMOJI[level]}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#58CC02]" />
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-xl p-4 text-red-600 text-sm">{error}</div>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 text-left">
                  <p className="text-sm text-gray-500">{questions.length} questions ready</p>
                  <p className="text-sm text-gray-500">
                    {[...new Set(questions.map((q) => q.micro_skill))].length} legal topics covered
                  </p>
                </div>
                <button
                  onClick={startLesson}
                  className="w-64 bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" /> Start Lesson
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <p className="text-amber-700 font-semibold">No questions available</p>
                <p className="text-amber-600 text-sm mt-1">Try a different Crown Level or page.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {phase === 'playing' && questions.length > 0 && (
        <LessonPlayer
          questions={questions}
          onComplete={handleComplete}
          onExit={() => setPhase('select')}
        />
      )}

      {phase === 'results' && results && (
        <LessonResult
          correct={results.correct}
          total={results.total}
          xpEarned={results.xpEarned}
          gemsEarned={results.gemsEarned}
          mistakes={results.mistakes}
          onRetry={() => setPhase('select')}
          onContinue={() => { setPhase('select'); router.push('/dashboard') }}
        />
      )}
    </div>
  )
}

export default function LearnPage({ params }: PageParams) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#58CC02]" />
      </div>
    }>
      <LearnPageContent page={params.page} />
    </Suspense>
  )
}
