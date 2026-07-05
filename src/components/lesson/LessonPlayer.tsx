'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import type { Question } from '@/types'
import { cn } from '@/lib/utils'

interface LessonPlayerProps {
  questions: Question[]
  onComplete: (results: { correct: number; total: number; mistakes: string[] }) => void
  onExit: () => void
}

export default function LessonPlayer({ questions, onComplete, onExit }: LessonPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [correctCount, setCorrectCount] = useState(0)
  const [mistakes, setMistakes] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const question = questions[currentIndex]
  if (!question) return null

  const isMSQ = question.type === 'msq'

  function handleSelect(id: string) {
    if (showFeedback) return
    if (isMSQ) {
      setSelectedAnswers((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      )
    } else {
      setSelectedAnswer(id)
    }
  }

  function checkAnswer() {
    if (isMSQ) {
      const correct = question.options
        .filter((o) => o.correct)
        .map((o) => o.id)
        .sort()
      const selected = [...selectedAnswers].sort()
      const isCorrectAnswer =
        correct.length === selected.length && correct.every((c, i) => c === selected[i])
      handleResult(isCorrectAnswer)
    } else {
      const option = question.options.find((o) => o.id === selectedAnswer)
      handleResult(option?.correct ?? false)
    }
  }

  function handleResult(correct: boolean) {
    setIsCorrect(correct)
    setShowFeedback(true)
    if (correct) {
      setCorrectCount((c) => c + 1)
    } else {
      setHearts((h) => h - 1)
      setMistakes((m) => [...m, question.micro_skill])
    }
  }

  function nextQuestion() {
    if (hearts <= 0) {
      onComplete({ correct: correctCount, total: questions.length, mistakes })
      return
    }
    if (currentIndex + 1 >= questions.length) {
      onComplete({ correct: correctCount, total: questions.length, mistakes })
      return
    }
    setSelectedAnswer(null)
    setSelectedAnswers([])
    setShowFeedback(false)
    setCurrentIndex((i) => i + 1)
  }

  const progress = ((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-2 pb-1">
        <button onClick={onExit} className="text-gray-400 text-sm font-semibold hover:text-gray-600">
          ✕ Exit
        </button>
        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <div className="flex justify-end mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                'w-5 h-5 transition-all',
                i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-200'
              )}
            />
          ))}
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            {/* Micro-skill & loophole tag */}
            <div className="flex gap-2 mb-3">
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                {question.micro_skill}
              </span>
              {question.loophole && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  Loophole
                </span>
              )}
            </div>

            {/* Question text */}
            <h2 className="text-xl font-bold text-gray-900 leading-relaxed mb-6">
              {question.question}
            </h2>

            {/* Scenario info */}
            {question.type === 'scenario' && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-900">
                {question.question.includes('Scenario:') ? null : question.feedback}
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = isMSQ
                  ? selectedAnswers.includes(option.id)
                  : selectedAnswer === option.id
                const showGreen = showFeedback && option.correct
                const showRed = showFeedback && isSelected && !option.correct

                return (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.97 }}
                    disabled={showFeedback}
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium',
                      showFeedback
                        ? showGreen
                          ? 'border-green-500 bg-green-50'
                          : showRed
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-100 bg-white opacity-50'
                        : isSelected
                          ? 'border-[#58CC02] bg-green-50/50'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2',
                          isSelected && !showFeedback
                            ? 'border-[#58CC02] bg-[#58CC02] text-white'
                            : 'border-gray-200 text-gray-500'
                        )}
                      >
                        {option.id.toUpperCase()}
                      </span>
                      <span className="text-gray-800">{option.text}</span>
                      {showFeedback && showGreen && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                      {showFeedback && showRed && (
                        <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* MSQ: show confirm button */}
            {isMSQ && selectedAnswers.length > 0 && !showFeedback && (
              <button
                onClick={checkAnswer}
                className="mt-6 w-full bg-[#58CC02] text-white font-bold py-3 rounded-xl hover:bg-[#46A302] transition-colors"
              >
                Check Answer
              </button>
            )}

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'mt-6 p-4 rounded-xl',
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                )}
              >
                <p className={cn('text-sm font-semibold mb-2', isCorrect ? 'text-green-700' : 'text-red-700')}>
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{question.feedback}</p>
                {question.oscoa_references?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-1">OSCOLA References:</p>
                    {question.oscoa_references.map((ref, i) => (
                      <p key={i} className="text-xs text-gray-500 italic">{ref}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      {showFeedback &&
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={nextQuestion}
            className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors flex items-center justify-center gap-2"
          >
            {hearts <= 0
              ? 'See Results'
              : currentIndex + 1 >= questions.length
                ? 'Complete Lesson'
                : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      }{
        // Show Check Answer for non-MSQ questions before feedback
        !isMSQ && selectedAnswer && !showFeedback && (
          <div className="px-4 py-4 border-t border-gray-100">
            <button
              onClick={checkAnswer}
              className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors"
            >
              Check Answer
            </button>
          </div>
        )
      }
    </div>
  )
}
