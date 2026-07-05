'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Story, StoryScene, Question } from '@/types'

interface StoryPageProps {
  params: { page: string }
}

export default function StoryPage({ params }: StoryPageProps) {
  const { page } = params
  const router = useRouter()
  const [story, setStory] = useState<Story | null>(null)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/stories?page=${page}`)
      if (res.ok) setStory(await res.json())
    }
    load()
  }, [page])

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-400">Loading story...</div>
      </div>
    )
  }

  const scene = story.scenes[sceneIndex]

  function handleAnswer(id: string) {
    if (!scene.question) return
    const option = scene.question.options.find((o) => o.id === id)
    setSelectedAnswer(id)
    setIsCorrect(option?.correct ?? false)
  }

  function nextScene() {
    setSelectedAnswer(null)
    setShowQuestion(false)
    if (sceneIndex + 1 >= story!.scenes.length) {
      setComplete(true)
    } else {
      setSceneIndex((i) => i + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <div className="px-4 py-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 max-w-lg mx-auto w-full">
        {complete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-2xl font-extrabold mb-2">Story Complete!</h1>
            <p className="text-gray-400 mb-6">You've mastered {story.title}</p>
            <button
              onClick={() => router.push(`/learn/${page}`)}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 transition-colors"
            >
              Back to Lessons
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className={`flex ${scene.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  scene.side === 'right'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white'
                }`}
                >
                  <p className="text-xs font-bold opacity-70 mb-1">{scene.character}</p>
                  <p className="leading-relaxed">{scene.dialogue}</p>
                </div>
              </div>

              {scene.question && !showQuestion && (
                <button
                  onClick={() => setShowQuestion(true)}
                  className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl text-sm"
                >
                  Answer a question to continue
                </button>
              )}

              {showQuestion && scene.question && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-4"
                >
                  <p className="font-semibold text-gray-900 mb-3">{scene.question.question}</p>
                  <div className="space-y-2">
                    {scene.question.options.map((opt) => {
                      const sel = selectedAnswer === opt.id
                      const green = sel && opt.correct
                      const red = sel && !opt.correct
                      return (
                        <button
                          key={opt.id}
                          disabled={selectedAnswer !== null}
                          onClick={() => handleAnswer(opt.id)}
                          className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all ${
                            selectedAnswer === null
                              ? 'border border-gray-200 hover:border-green-300'
                              : green
                                ? 'border-2 border-green-500 bg-green-50'
                                : red
                                  ? 'border-2 border-red-400 bg-red-50'
                                  : 'border border-gray-100 opacity-50'
                          }`}
                        >
                          {opt.text}
                        </button>
                      )
                    })}
                  </div>
                  {selectedAnswer && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {isCorrect ? 'Correct!' : 'Not quite'}
                      </p>
                      {scene.question.feedback && (
                        <p className="text-xs text-gray-600 mt-1">{scene.question.feedback}</p>
                      )}
                      <button
                        onClick={nextScene}
                        className="mt-3 w-full bg-[#58CC02] text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {!scene.question && (
                <button
                  onClick={nextScene}
                  className="w-full text-white/50 hover:text-white text-sm py-2 flex items-center justify-center gap-1"
                >
                  Tap to continue <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
