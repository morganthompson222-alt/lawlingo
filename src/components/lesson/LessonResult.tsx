'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, ArrowRight, RefreshCw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CROWN_EMOJI } from '@/types'

interface LessonResultProps {
  correct: number
  total: number
  xpEarned: number
  gemsEarned: number
  mistakes: string[]
  onRetry: () => void
  onContinue: () => void
}

export default function LessonResult({
  correct,
  total,
  xpEarned,
  gemsEarned,
  mistakes,
  onRetry,
  onContinue,
}: LessonResultProps) {
  const passed = correct / total >= 0.7

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-sm w-full"
      >
        {passed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
          >
            <Trophy className="w-12 h-12 text-green-600" />
          </motion.div>
        ) : (
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-12 h-12 text-red-500" />
          </div>
        )}

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          {passed ? 'Lesson Complete!' : 'Try Again'}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-1 text-lg font-bold text-orange-500">
            <Star className="w-5 h-5 fill-orange-500" />
            +{xpEarned} XP
          </div>
          <div className="flex items-center gap-1 text-lg font-bold text-blue-500">
            <span className="text-xl">💎</span>
            +{gemsEarned}
          </div>
        </div>

        <p className="text-gray-500 mb-2">
          {correct}/{total} correct
        </p>

        {mistakes.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-amber-700 mb-2">Areas to review:</p>
            {mistakes.map((m, i) => (
              <p key={i} className="text-xs text-amber-600">• {m}</p>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-[#58CC02] text-white font-bold py-3.5 rounded-xl hover:bg-[#46A302] transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
          {!passed && (
            <button
              onClick={onRetry}
              className="w-full bg-white text-[#58CC02] font-bold py-3.5 rounded-xl border-2 border-[#58CC02] hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
