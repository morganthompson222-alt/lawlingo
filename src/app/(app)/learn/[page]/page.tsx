'use client'

import { useEffect, useState, Suspense, use, Component } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Play, BookOpen, AlertTriangle } from 'lucide-react'
import SenecaLessonPlayer from '@/components/lesson/SenecaLessonPlayer'
import LessonResult from '@/components/lesson/LessonResult'
import type { Question } from '@/types'
import { CROWN_EMOJI, CROWN_NAMES } from '@/types'
import { calculateLessonXP } from '@/lib/gamification'
import { useUserStore } from '@/store/user'

class ErrorBoundary extends Component<{ children: React.ReactNode; fallback: string }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6">{this.props.fallback}</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
              className="bg-[#58CC02] text-white font-bold py-3 px-8 rounded-xl"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function LearnPageContent({ page }: { page: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { profile, addXP, addGems } = useUserStore()

  const crownParam = searchParams.get('crown') || '1'
  const crownLevel = parseInt(crownParam)

  const [lesson, setLesson] = useState<any>(null)
  const [allQuestions, setAllQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<'select' | 'playing' | 'results'>('select')
  const [results, setResults] = useState<any>(null)
  const [saveState, setSaveState] = useState<any>(null)
  const [lessonCompleted, setLessonCompleted] = useState(false)

  const lessonId = `lesson-${page}1-1`
  const microSkill = `${page}1.1`

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [lessonRes, progressRes] = await Promise.all([
          fetch(`/api/lessons?lessonId=${lessonId}&microSkill=${microSkill}`),
          fetch(`/api/progress/lessons?lessonId=${lessonId}`),
        ])

        if (lessonRes.ok) {
          const data = await lessonRes.json()
          setLesson(data)
          const all = [
            ...data.blocks.flatMap((b: any) => [b.teaching, ...b.questions]),
            ...(data.consolidation?.questions || []),
          ].filter(Boolean)
          setAllQuestions(all)
        } else {
          setError('No Seneca-style lesson available yet. Try a different page.')
        }

        if (progressRes.ok) {
          const progressData = await progressRes.json()
          if (progressData.saveState?.state) {
            setSaveState(progressData.saveState.state)
          }
          if (progressData.completion) {
            setLessonCompleted(true)
          }
        }
      } catch {
        setError('Could not load lesson data')
      }
      setLoading(false)
    }
    load()
  }, [page, crownLevel])

  function startLesson(resume = false) {
    if (allQuestions.length === 0) return
    if (!resume) {
      // Clear saved state if starting fresh
      setSaveState(null)
      fetch(`/api/progress/lessons?lessonId=${lessonId}`, { method: 'DELETE' }).catch(() => {})
    }
    setPhase('playing')
  }

  function handleProgressSave(state: Record<string, unknown>) {
    fetch('/api/progress/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, microSkill, state }),
    }).catch(() => {})
  }

  async function handleComplete(r: { correct: number; total: number; mistakes: string[] }) {
    const xp = calculateLessonXP(profile?.streak ?? 0, 60)
    const gems = r.correct >= Math.ceil(r.total * 0.7) ? 10 : 3
    setResults({ ...r, xpEarned: xp.total, gemsEarned: gems })
    addXP(xp.total)
    addGems(gems)
    setPhase('results')

    // Persist completion to server & unlock crown
    fetch('/api/progress/lessons', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId, microSkill,
        correct: r.correct, total: r.total,
        mistakes: r.mistakes,
        complete: true,
      }),
    }).catch(() => {})
  }

  return (
    <div>
      {phase === 'select' && (
        <div className="px-4 py-6">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-5xl mb-4">{CROWN_EMOJI[crownLevel]}</div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{CROWN_NAMES[crownLevel]} Crown</h1>
            <p className="text-gray-500 mb-8">Page {page} — Seneca-Style Lesson</p>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#58CC02]" />
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-xl p-4 text-red-600 text-sm">{error}</div>
            ) : allQuestions.length > 0 ? (
              <div className="space-y-4">
                {lessonCompleted && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-green-700 font-semibold">Lesson Completed</p>
                    <p className="text-green-600 text-sm mt-1">You've already finished this lesson. You can replay it.</p>
                  </div>
                )}
                {saveState && !lessonCompleted && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-amber-700 font-semibold">Lesson In Progress</p>
                    <p className="text-amber-600 text-sm mt-1">You have a saved lesson. Resume from where you left off?</p>
                    <div className="flex gap-3 mt-3">
                      <button onClick={() => startLesson(true)} className="bg-amber-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm">
                        Resume Lesson
                      </button>
                      <button onClick={() => startLesson(false)} className="text-amber-600 font-medium py-2.5 px-4 rounded-xl text-sm border border-amber-200">
                        Start Fresh
                      </button>
                    </div>
                  </div>
                )}
                {!saveState && !saveState && (
                  <>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">{lesson?.microSkill} — {lesson?.blocks?.length || 3} Teaching Blocks</span>
                      </div>
                      <p className="text-sm text-gray-500">{allQuestions.filter((q: any) => q.type !== 'teaching').length} practice questions</p>
                      <p className="text-sm text-gray-500">3 teaching summaries + consolidation + mistake review</p>
                    </div>
                    <button
                      onClick={() => startLesson(false)}
                      className="w-64 bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      <Play className="w-5 h-5" /> Start Lesson
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <p className="text-amber-700 font-semibold">Seneca-Style Lesson Coming Soon</p>
                <p className="text-amber-600 text-sm mt-1">This page hasn't been converted to the new format yet. Only Page A, Micro-Skill A1.1 has the gold-standard Seneca lesson. More coming soon.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {phase === 'playing' && allQuestions.length > 0 && (
        <ErrorBoundary fallback="Lesson player encountered an error. Please refresh and try again.">
          <SenecaLessonPlayer
            lessonId={lessonId}
            questions={allQuestions}
            microSkill={microSkill}
            onComplete={handleComplete}
            onExit={() => setPhase('select')}
            onProgressSave={handleProgressSave}
            initialState={saveState}
          />
        </ErrorBoundary>
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

export default function LearnPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params)
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-[#58CC02]" /></div>}>
      <LearnPageContent page={page} />
    </Suspense>
  )
}
