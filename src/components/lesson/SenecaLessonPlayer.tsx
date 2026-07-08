'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ArrowRight, ArrowLeft, Heart, CheckCircle2, XCircle, Loader2, Trophy, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonQuestion {
  id: string
  lessonId: string
  microSkill: string
  block: string
  phase: string
  teachingSummary?: string
  type: string
  question: string
  answer: string
  options: Array<{ id?: string; text?: string; correct?: boolean; feedback?: string; pair?: string; order?: number }>
  feedback: string
  oscoaReferences: string[]
  difficulty: string
}

interface Props {
  lessonId: string
  questions: LessonQuestion[]
  onComplete: (results: { correct: number; total: number; mistakes: string[] }) => void
  onExit: () => void
}

type Phase = 'reading' | 'answering' | 'feedback'

export default function SenecaLessonPlayer({ lessonId, questions, onComplete, onExit }: Props) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('reading')
  const [hearts, setHearts] = useState(5)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [mistakes, setMistakes] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showMistakeReview, setShowMistakeReview] = useState(false)
  const [mistakeQueue, setMistakeQueue] = useState<LessonQuestion[]>([])
  const [completing, setCompleting] = useState(false)

  // Organise questions by block
  const blocks = ['A', 'B', 'C']
  const blockQuestions = blocks
    .filter(b => b === blocks[currentBlockIndex] || blocks.indexOf(b) < blocks.indexOf(blocks[currentBlockIndex]))
    .reduce((acc, b) => {
      acc[b] = questions.filter(q => q.block === b && q.phase === 'teaching' && q.type !== 'teaching')
      return acc
    }, {} as Record<string, LessonQuestion[]>)

  const consolidationQuestions = questions.filter(q => q.phase === 'consolidation')

  // Get the teaching summary for the current block
  const currentBlock = blocks[currentBlockIndex]
  const currentBlockTeaching = questions.find(q => q.block === currentBlock && q.type === 'teaching')
  const currentQuestions = blockQuestions[currentBlock] || []
  const currentQuestion = currentQuestions[currentQuestionIndex]

  // Check if all blocks and consolidation are complete
  const allBlocksDone = currentBlockIndex >= 3
  const stepIndex =
    currentBlockIndex < 3
      ? `${currentBlockIndex + 1}/3`
      : `${blocks.length}/3`

  function handleAnswer(id: string) {
    if (phase !== 'answering') return
    const q = currentQuestion

    if (q.type === 'msq') {
      // Handle multi-select differently — will implement fully later
      const correct = q.options?.filter(o => o.correct).map(o => o.id).sort().join(',') === id
      setIsCorrect(correct)
      setSelectedAnswer(id)
      setPhase('feedback')
    } else {
      const option = q.options?.find(o => o.id === id)
      const correct = option?.correct ?? false
      setIsCorrect(correct)
      setSelectedAnswer(id)
      setPhase('feedback')
    }
  }

  function advanceQuestion() {
    if (!currentQuestion) return

    setTotalQuestions(t => t + (currentQuestion.type !== 'teaching' ? 1 : 0))
    if (isCorrect && currentQuestion.type !== 'teaching') {
      setTotalCorrect(c => c + 1)
    } else if (!isCorrect && currentQuestion.type !== 'teaching') {
      const q = currentQuestion
      setMistakes(m => [...m, q.microSkill || ''])
      setHearts(h => Math.max(0, h - 1))
      setMistakeQueue(m => [...m, q])
    }

    if (hearts <= 0 && !isCorrect) {
      setCompleting(true)
      return
    }

    if (currentQuestionIndex + 1 < currentQuestions.length) {
      setCurrentQuestionIndex(i => i + 1)
      setSelectedAnswer(null)
      setPhase(currentQuestion.type === 'teaching' ? 'reading' : 'answering')
    } else {
      // Advance to next block
      if (currentBlockIndex < 2) {
        setCurrentBlockIndex(i => i + 1)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setPhase('reading')
      } else {
        // All 3 blocks done — show consolidation
        setCompleting(true)
      }
    }
  }

  function startReading() {
    setPhase('answering')
  }

  function handleComplete() {
    onComplete({
      correct: totalCorrect + (isCorrect ? 1 : 0),
      total: totalQuestions + (currentQuestion?.type !== 'teaching' ? 1 : 0),
      mistakes: [...new Set(mistakes)],
    })
  }

  // Render teaching card
  if (currentBlockTeaching && phase === 'reading' && !allBlocksDone) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <button onClick={onExit} className="text-gray-400 text-sm font-semibold">✕ Exit</button>
          <span className="text-sm font-semibold text-gray-400">Block {stepIndex}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Key Concept</span>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-800 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{
                __html: currentBlockTeaching.teachingSummary!
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\n/g, '<br/>')
                  .replace(/\* (.*?) \(/g, '* <em>$1</em> (')
                  .replace(/\[(\d{4})\]/g, '[$1]')
              }}
            />
            <div className="mt-6 pt-4 border-t border-green-200">
              <p className="text-xs text-green-600 mb-1">OSCOLA References:</p>
              {currentBlockTeaching.oscoaReferences?.map((ref, i) => (
                <p key={i} className="text-xs text-green-600 italic">{ref}</p>
              ))}
            </div>
          </motion.div>
          <button
            onClick={startReading}
            className="mt-8 w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors flex items-center justify-center gap-2"
          >
            Got it — Start Questions <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // Render question
  if (currentQuestion && phase !== 'reading' && !allBlocksDone && !completing) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onExit} className="text-gray-400 text-sm font-semibold">✕ Exit</button>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart key={i} className={cn('w-4 h-4', i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-200')} />
              ))}
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              animate={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Block {currentBlock} · Q{currentQuestionIndex + 1}/{currentQuestions.length}</p>
        </div>

        <div className="flex-1 flex flex-col px-4 pt-4">
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-6">{currentQuestion.question}</h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options?.map((opt, i) => {
                  const sel = selectedAnswer === opt.id
                  const green = sel && opt.correct
                  const red = sel && !opt.correct
                  const dim = phase === 'feedback' && !sel && !opt.correct
                  return (
                    <motion.button
                      key={opt.id || i}
                      whileTap={{ scale: 0.98 }}
                      disabled={phase === 'feedback'}
                      onClick={() => handleAnswer(opt.id || '')}
                      className={cn(
                        'w-full text-left p-3.5 rounded-xl border-2 transition-all font-medium text-sm',
                        dim && 'opacity-40',
                        green && 'border-green-500 bg-green-50',
                        red && 'border-red-400 bg-red-50',
                        sel && !green && !red && 'border-[#58CC02] bg-green-50/50 scale-[1.01]',
                        !sel && !dim && 'border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0', sel && !green && !red ? 'border-[#58CC02] bg-[#58CC02] text-white' : 'border-gray-200 text-gray-500')}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.text}</span>
                        {green && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                        {red && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Feedback */}
              {phase === 'feedback' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn('mt-6 p-4 rounded-xl', isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200')}>
                  <p className={cn('text-sm font-bold mb-1', isCorrect ? 'text-green-700' : 'text-red-600')}>
                    {isCorrect ? 'Correct!' : 'Not quite'}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.feedback}</p>
                  {currentQuestion.oscoaReferences?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      {currentQuestion.oscoaReferences.map((ref, i) => (
                        <p key={i} className="text-xs text-gray-500 italic">{ref}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {phase === 'feedback' &&
          <div className="px-4 py-4 border-t border-gray-100">
            <button onClick={advanceQuestion} className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors flex items-center justify-center gap-2">
              {hearts <= 0 && !isCorrect ? 'See Results' : currentBlockIndex === 2 && currentQuestionIndex + 1 >= currentQuestions.length ? 'Complete Lesson' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        }
      </div>
    )
  }

  // Completing — show consolidation or mistake review
  if (completing && !showMistakeReview) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center max-w-sm">
          {mistakeQueue.length > 0 ? (
            <>
              <RefreshCw className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Review Your Mistakes</h2>
              <p className="text-gray-500 mb-6">{mistakeQueue.length} questions need another look</p>
              <button
                onClick={() => { setShowMistakeReview(true); setCurrentQuestionIndex(0); setPhase('answering') }}
                className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-colors"
              >
                Review Mistakes ({mistakeQueue.length})
              </button>
            </>
          ) : (
            <>
              <Trophy className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Lesson Complete!</h2>
              <p className="text-gray-500 mb-6">You scored {totalCorrect}/{totalQuestions}</p>
              <button onClick={handleComplete} className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors">
                See Results
              </button>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  // Mistake review loop
  if (showMistakeReview && mistakeQueue.length > 0) {
    const mq = mistakeQueue[currentQuestionIndex]
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs text-amber-600 font-bold">Mistake Review · {currentQuestionIndex + 1}/{mistakeQueue.length}</p>
        </div>
        <div className="flex-1 flex flex-col px-4 pt-4">
          <motion.div key={mq.id + '-review'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-6">{mq.question}</h2>
            <div className="space-y-2.5">
              {mq.options?.map((opt, i) => {
                const sel = selectedAnswer === opt.id
                const green = sel && opt.correct
                const red = sel && !opt.correct
                return (
                  <motion.button
                    key={opt.id || i}
                    whileTap={{ scale: 0.98 }}
                    disabled={phase === 'feedback'}
                    onClick={() => handleAnswer(opt.id || '')}
                    className={cn(
                      'w-full text-left p-3.5 rounded-xl border-2 transition-all font-medium text-sm',
                      phase === 'feedback' && !opt.correct && 'opacity-40',
                      green && 'border-green-500 bg-green-50',
                      red && 'border-red-400 bg-red-50',
                      !green && !red && 'border-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-200 text-gray-500">{String.fromCharCode(65 + i)}</span>
                      <span>{opt.text}</span>
                      {green && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                      {red && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>
            {phase === 'feedback' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-bold text-amber-700 mb-1">{isCorrect ? 'Correct this time!' : 'The correct answer:'}</p>
                <p className="text-sm text-gray-700">{mq.feedback}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
        {phase === 'feedback' &&
          <div className="px-4 py-4 border-t border-gray-100">
            <button
              onClick={() => {
                if (isCorrect) {
                  // Remove from queue
                  setMistakeQueue(q => q.filter((_, j) => j !== currentQuestionIndex))
                  if (currentQuestionIndex + 1 >= mistakeQueue.length - 1) {
                    handleComplete()
                  }
                }
                setCurrentQuestionIndex(i => i + 1)
                setSelectedAnswer(null)
                setPhase('answering')
              }}
              className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl"
            >
              Continue
            </button>
          </div>
        }
      </div>
    )
  }

  // Fallback
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#58CC02]" />
    </div>
  )
}
