'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ArrowRight, ArrowLeft, Heart, CheckCircle2, XCircle, Loader2, Trophy, RefreshCw, Type } from 'lucide-react'
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
  const [isAlmostCorrect, setIsAlmostCorrect] = useState(false)
  const [selectedMsqAnswers, setSelectedMsqAnswers] = useState<string[]>([])
  const [dragOrder, setDragOrder] = useState<string[]>([])
  const [dragInitialised, setDragInitialised] = useState(false)
  const [showMistakeReview, setShowMistakeReview] = useState(false)
  const [mistakeQueue, setMistakeQueue] = useState<LessonQuestion[]>([])
  const [completing, setCompleting] = useState(false)
  const [textAnswer, setTextAnswer] = useState('')
  const textInputRef = useRef<HTMLInputElement | null>(null)

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

  const isFillGap = currentQuestion?.type?.startsWith('fill_gap') || currentQuestion?.type === 'spot_error'
  const isMsq = currentQuestion?.type === 'msq'
  const isDragElements = currentQuestion?.type === 'drag_elements'
  const hasOptions = (currentQuestion?.options?.length || 0) > 0 && !isDragElements
  const msqCorrectCount = isMsq ? currentQuestion?.options?.filter(o => o.correct).length ?? 0 : 0

  useEffect(() => {
    if (isDragElements && currentQuestion && !dragInitialised) {
      const ids = (currentQuestion.options || []).map(o => o.id || '')
      const shuffled = [...ids].sort(() => Math.random() - 0.5)
      setDragOrder(shuffled)
      setDragInitialised(true)
    }
    if (!isDragElements) {
      setDragInitialised(false)
    }
  }, [currentQuestion?.id, isDragElements, dragInitialised])

  // Check if all blocks and consolidation are complete
  const allBlocksDone = currentBlockIndex >= 3
  const stepIndex =
    currentBlockIndex < 3
      ? `${currentBlockIndex + 1}/3`
      : `${blocks.length}/3`

  function handleAnswer(id: string) {
    if (phase !== 'answering') return

    if (isMsq) {
      setSelectedMsqAnswers(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      )
      return
    }

    const option = currentQuestion?.options?.find(o => o.id === id)
    const correct = option?.correct ?? false
    setIsCorrect(correct)
    setSelectedAnswer(id)
    setPhase('feedback')
  }

  function handleSubmitMsq() {
    if (selectedMsqAnswers.length === 0 || !currentQuestion) return
    const correctIds = currentQuestion.options?.filter(o => o.correct).map(o => o.id) || []
    const hasWrong = selectedMsqAnswers.some(id => !correctIds.includes(id))
    const correctCount = selectedMsqAnswers.filter(id => correctIds.includes(id)).length
    const allCorrectSelected = correctCount === correctIds.length

    if (allCorrectSelected && !hasWrong) {
      setIsCorrect(true)
      setIsAlmostCorrect(false)
    } else if (correctCount >= 1 && !hasWrong && correctCount < correctIds.length) {
      setIsCorrect(false)
      setIsAlmostCorrect(true)
      setSelectedAnswer(selectedMsqAnswers.join(','))
    } else {
      setIsCorrect(false)
      setIsAlmostCorrect(false)
      setSelectedAnswer(selectedMsqAnswers.join(','))
    }
    setPhase('feedback')
  }

  function moveDragItem(id: string, direction: 'up' | 'down') {
    if (phase === 'feedback') return
    setDragOrder(prev => {
      const idx = prev.indexOf(id)
      if (idx === -1) return prev
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
      return next
    })
  }

  function handleSubmitDrag() {
    if (!currentQuestion) return
    const correctOrder = currentQuestion.options?.filter(o => o.order != null).sort((a, b) => (a.order || 0) - (b.order || 0)).map(o => o.id || '') || []
    const correctCount = dragOrder.filter((id, i) => id === correctOrder[i]).length
    const totalCount = correctOrder.length

    if (correctCount === totalCount) {
      setIsCorrect(true)
      setIsAlmostCorrect(false)
    } else if (correctCount >= totalCount - 1 && correctCount > 0) {
      setIsCorrect(false)
      setIsAlmostCorrect(true)
    } else {
      setIsCorrect(false)
      setIsAlmostCorrect(false)
    }
    setSelectedAnswer(correctOrder.join(','))
    setPhase('feedback')
  }

  function advanceQuestion() {
    if (!currentQuestion) return

    setTotalQuestions(t => t + (currentQuestion.type !== 'teaching' ? 1 : 0))
    if ((isCorrect || isAlmostCorrect) && currentQuestion.type !== 'teaching') {
      setTotalCorrect(c => c + 1)
    } else if (!isCorrect && !isAlmostCorrect && currentQuestion.type !== 'teaching') {
      const q = currentQuestion
      setMistakes(m => [...m, q.microSkill || ''])
      setHearts(h => Math.max(0, h - 1))
      setMistakeQueue(m => [...m, q])
    }

    if (hearts <= 0 && !isCorrect && !isAlmostCorrect) {
      setCompleting(true)
      return
    }

    if (currentQuestionIndex + 1 < currentQuestions.length) {
      setCurrentQuestionIndex(i => i + 1)
      setSelectedAnswer(null)
      setIsAlmostCorrect(false)
      setTextAnswer('')
      setSelectedMsqAnswers([])
      setDragOrder([])
      setDragInitialised(false)
      setPhase(currentQuestion.type === 'teaching' ? 'reading' : 'answering')
      setTimeout(() => textInputRef.current?.focus(), 100)
    } else {
      if (currentBlockIndex < 2) {
        setCurrentBlockIndex(i => i + 1)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setIsAlmostCorrect(false)
        setTextAnswer('')
        setSelectedMsqAnswers([])
        setDragOrder([])
        setDragInitialised(false)
        setPhase('reading')
      } else {
        setCompleting(true)
      }
    }
  }

  function startReading() {
    setPhase('answering')
    setTextAnswer('')
    setTimeout(() => textInputRef.current?.focus(), 100)
  }

  function fuzzyMatch(user: string, correct: string, type: string): { score: number; correct: boolean; almost: boolean } {
    const userNorm = user.toLowerCase().replace(/[.,;:!?]/g, '').trim()
    const correctNorm = correct.toLowerCase().replace(/[.,;:!?]/g, '').trim()

    if (userNorm === correctNorm) return { score: 1, correct: true, almost: false }

    const userWords = userNorm.split(/\s+/).filter(Boolean)
    const correctWords = correctNorm.split(/\s+/).filter(Boolean)

    if (userWords.length === 0) return { score: 0, correct: false, almost: false }

    const matched = correctWords.filter(w => userWords.includes(w)).length
    const contained = correctWords.filter(w => userNorm.includes(w)).length
    const bestMatches = Math.max(matched, contained)
    const score = correctWords.length > 0 ? bestMatches / correctWords.length : 0

    if (type === 'fill_gap_case' || type === 'fill_gap_statute') {
      const correctCaseMatch = correctWords.some(w => userNorm.includes(w))
      if (correctCaseMatch && score >= 0.35) return { score, correct: false, almost: true }
      return { score, correct: score >= 0.65, almost: score >= 0.35 && score < 0.65 }
    }

    if (type === 'spot_error') {
      const keyTerms = ['invitation', 'treat', 'offer', 'contract', 'binding', 'refuse', 'accept', 'till', 'checkout', 'display', 'boots', 'immediate', 'formed', 'not', 'no', 'legal', 'customer', 'shop']
      const keyMatches = keyTerms.filter(k => userNorm.includes(k)).length
      const adjustedScore = Math.max(score, keyMatches / Math.min(keyTerms.length, 12))
      const keywordRich = keyMatches >= 3

      if (adjustedScore >= 0.6 || (adjustedScore >= 0.4 && keywordRich)) return { score: adjustedScore, correct: false, almost: true }
      return { score: adjustedScore, correct: adjustedScore >= 0.85, almost: adjustedScore >= 0.4 && adjustedScore < 0.85 }
    }

    const threshold = type === 'msq' ? 0.7 : 0.6
    if (score >= threshold) return { score, correct: false, almost: true }
    return { score, correct: score >= 0.85, almost: score >= threshold && score < 0.85 }
  }

  function handleSubmitText() {
    if (!textAnswer.trim() || !currentQuestion) return
    const userAnswer = textAnswer.toLowerCase().trim()
    const correctAnswer = currentQuestion.answer?.toLowerCase().trim()
    const result = fuzzyMatch(userAnswer, correctAnswer, currentQuestion.type)
    setIsCorrect(result.correct)
    setIsAlmostCorrect(result.almost)
    setSelectedAnswer(result.correct ? 'correct' : result.almost ? 'almost' : 'wrong')
    setPhase('feedback')
  }

  function handleComplete() {
    onComplete({
      correct: totalCorrect + (isCorrect || isAlmostCorrect ? 1 : 0),
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
            <div className="text-sm text-gray-800 leading-relaxed space-y-3 whitespace-pre-line">
              {currentBlockTeaching.teachingSummary || ''}
            </div>
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

              {/* Fill-gap / text input questions */}
              {isFillGap && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      ref={textInputRef}
                      type="text"
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitText() }}
                      disabled={phase === 'feedback'}
                      placeholder="Type your answer..."
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#58CC02] focus:ring-1 focus:ring-[#58CC02] outline-none text-lg font-medium transition-colors"
                      autoFocus
                    />
                    <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  </div>
                  {phase !== 'feedback' && textAnswer.trim() && (
                    <button
                      onClick={handleSubmitText}
                      className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors"
                    >
                      Check Answer
                    </button>
                  )}
                </div>
              )}

              {/* Drag elements — sequencing/ordering questions */}
              {isDragElements && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 font-medium mb-1">
                    Tap arrows to arrange in the correct order
                  </p>
                  {dragOrder.map((id, idx) => {
                    const opt = currentQuestion?.options?.find(o => o.id === id)
                    if (!opt) return null
                    const isFirst = idx === 0
                    const isLast = idx === dragOrder.length - 1
                    const showOrder = phase === 'feedback'
                    const correctPos = opt.order === idx + 1
                    const wrongPos = showOrder && !correctPos

                    return (
                      <div
                        key={id}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-sm font-medium',
                          phase === 'feedback' && correctPos && 'border-green-500 bg-green-50',
                          phase === 'feedback' && wrongPos && 'border-red-400 bg-red-50',
                          phase !== 'feedback' && 'border-gray-200 bg-white',
                        )}
                      >
                        {phase !== 'feedback' ? (
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              onClick={() => moveDragItem(id, 'up')}
                              disabled={isFirst}
                              className={cn(
                                'w-7 h-6 flex items-center justify-center rounded-t text-xs leading-none',
                                isFirst ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100'
                              )}
                            >
                              &#9650;
                            </button>
                            <button
                              onClick={() => moveDragItem(id, 'down')}
                              disabled={isLast}
                              className={cn(
                                'w-7 h-6 flex items-center justify-center rounded-b text-xs leading-none',
                                isLast ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100'
                              )}
                            >
                              &#9660;
                            </button>
                          </div>
                        ) : (
                          <span className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0',
                            correctPos ? 'border-green-500 bg-green-500 text-white' : 'border-red-300 bg-red-300 text-white'
                          )}>
                            {idx + 1}
                          </span>
                        )}
                        <span className={cn(phase === 'feedback' && wrongPos && 'line-through text-red-500')}>
                          {opt.text}
                        </span>
                        {showOrder && correctPos && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                        )}
                        {showOrder && wrongPos && (
                          <span className="ml-auto text-xs text-red-400 font-medium">should be #{opt.order}</span>
                        )}
                      </div>
                    )
                  })}
                  {phase !== 'feedback' && (
                    <button
                      onClick={handleSubmitDrag}
                      className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors mt-3"
                    >
                      Check Order
                    </button>
                  )}
                </div>
              )}

              {/* Options-based questions */}
              {hasOptions && (
              <div className="space-y-2.5">
                {isMsq && phase === 'answering' && (
                  <p className="text-sm text-gray-400 font-medium mb-1">
                    Select {msqCorrectCount} {msqCorrectCount === 1 ? 'answer' : 'answers'}
                  </p>
                )}
                {currentQuestion.options?.map((opt, i) => {
                  const optId = opt.id || ''
                  const isSelected = isMsq
                    ? selectedMsqAnswers.includes(optId)
                    : selectedAnswer === optId
                  const isCorrectOpt = opt.correct
                  const isWrongPick = phase === 'feedback' && isSelected && !isCorrectOpt
                  const isMissedCorrect = phase === 'feedback' && !isSelected && isCorrectOpt
                  const isSelectedCorrect = phase === 'feedback' && isSelected && isCorrectOpt
                  const dim = phase === 'feedback' && !isSelected && !isCorrectOpt

                  return (
                    <motion.button
                      key={opt.id || i}
                      whileTap={{ scale: 0.98 }}
                      disabled={phase === 'feedback'}
                      onClick={() => handleAnswer(opt.id || '')}
                      className={cn(
                        'w-full text-left p-3.5 rounded-xl border-2 transition-all font-medium text-sm',
                        dim && 'opacity-40',
                        isSelectedCorrect && 'border-green-500 bg-green-50',
                        isWrongPick && 'border-red-400 bg-red-50',
                        isMissedCorrect && 'border-green-400 bg-green-50/50 border-dashed',
                        isSelected && phase !== 'feedback' && 'border-[#58CC02] bg-green-50/50',
                        !isSelected && !dim && 'border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'w-6 h-6 flex items-center justify-center text-xs font-bold border-2 shrink-0',
                          isMsq ? 'rounded' : 'rounded-full',
                          isSelected && phase !== 'feedback' && 'border-[#58CC02] bg-[#58CC02] text-white',
                          isSelectedCorrect && 'border-green-500 bg-green-500 text-white',
                          isWrongPick && 'border-red-400 bg-red-400 text-white',
                          isMissedCorrect && 'border-green-400 text-green-600',
                          !isSelected && !dim && 'border-gray-200 text-gray-500'
                        )}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.text}</span>
                        {isSelectedCorrect && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                        {isWrongPick && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                        {isMissedCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto shrink-0 opacity-50" />}
                      </div>
                    </motion.button>
                  )
                })}
                {isMsq && phase === 'answering' && selectedMsqAnswers.length > 0 && (
                  <button
                    onClick={handleSubmitMsq}
                    className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors mt-3"
                  >
                    Check Answer ({selectedMsqAnswers.length})
                  </button>
                )}
              </div>
              )}

              {/* Feedback */}
              {phase === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'mt-6 p-4 rounded-xl',
                    isCorrect && 'bg-green-50 border border-green-200',
                    isAlmostCorrect && 'bg-amber-50 border border-amber-200',
                    !isCorrect && !isAlmostCorrect && 'bg-red-50 border border-red-200'
                  )}
                >
                  <p className={cn(
                    'text-sm font-bold mb-1',
                    isCorrect && 'text-green-700',
                    isAlmostCorrect && 'text-amber-700',
                    !isCorrect && !isAlmostCorrect && 'text-red-600'
                  )}>
                    {isCorrect ? 'Correct!' : isAlmostCorrect ? 'Almost there!' : 'Not quite'}
                  </p>
                  {isFillGap && (!isCorrect || isAlmostCorrect) && (
                    <p className={cn('text-sm font-semibold mb-2', isAlmostCorrect ? 'text-amber-800' : 'text-gray-800')}>
                      Correct answer: <span className="text-[#58CC02]">{currentQuestion.answer}</span>
                    </p>
                  )}
                  {isMsq && !isCorrect && (
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      Correct answers:{' '}
                      {currentQuestion.options?.filter(o => o.correct).map((o, i) => (
                        <span key={o.id}>
                          <span className="text-[#58CC02]">{o.id?.toUpperCase()}</span>{i < (currentQuestion.options?.filter(o => o.correct).length || 1) - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
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
              {hearts <= 0 && !isCorrect && !isAlmostCorrect ? 'See Results' : currentBlockIndex === 2 && currentQuestionIndex + 1 >= currentQuestions.length ? 'Complete Lesson' : 'Continue'}
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
