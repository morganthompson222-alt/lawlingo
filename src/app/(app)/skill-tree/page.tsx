'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PAGE_NAMES, PAGE_EMOJI, CROWN_EMOJI, CROWN_NAMES } from '@/types'
import type { CrownProgress } from '@/types'

const PAGES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const PAGE_DEPENDENCIES: Record<string, string[]> = {
  E: ['A', 'B', 'C', 'D'],
  H: ['E', 'F', 'G'],
}

export default function SkillTreePage() {
  const router = useRouter()
  const [crowns, setCrowns] = useState<CrownProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/progress/crowns')
        if (res.ok) setCrowns(await res.json())
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  function getCrownProgress(page: string, level: number): CrownProgress | undefined {
    return crowns.find((c) => c.page === page && c.level === level)
  }

  function isPageUnlocked(page: string): boolean {
    const deps = PAGE_DEPENDENCIES[page]
    if (!deps) return true
    return deps.every((dep) => {
      const depCrown = crowns.find((c) => c.page === dep && c.level === 2)
      return depCrown?.completed
    })
  }

  function isCrownUnlocked(page: string, level: number): boolean {
    if (level === 1 && isPageUnlocked(page)) return true
    const prev = getCrownProgress(page, level - 1)
    return prev?.completed ?? false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">Loading skill tree...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Skill Tree</h1>
      <p className="text-sm text-gray-500 mb-6">Complete Crowns to unlock advanced topics</p>

      <div className="space-y-4">
        {PAGES.map((page, pageIdx) => {
          const unlocked = isPageUnlocked(page)
          const pageName = PAGE_NAMES[page]
          const emoji = PAGE_EMOJI[page]

          return (
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pageIdx * 0.05 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                unlocked ? 'border-gray-100' : 'border-gray-100 opacity-50'
              }`}
            >
              <div className="p-4 border-b border-gray-50 flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{pageName}</h3>
                  <p className="text-xs text-gray-500">Page {page}</p>
                </div>
                {!unlocked && <Lock className="w-4 h-4 text-gray-400" />}
              </div>

              <div className="p-3 flex gap-2 overflow-x-auto">
                {[1, 2, 3, 4, 5].map((level) => {
                  const progress = getCrownProgress(page, level)
                  const completed = progress?.completed
                  const crownUnlocked = isCrownUnlocked(page, level)

                  return (
                    <button
                      key={level}
                      disabled={!crownUnlocked}
                      onClick={() => crownUnlocked && router.push(`/learn/${page}?crown=${level}`)}
                      className={`flex-shrink-0 w-20 p-3 rounded-xl text-center transition-all ${
                        completed
                          ? 'bg-green-50 border border-green-200'
                          : crownUnlocked
                            ? 'bg-gray-50 border border-gray-200 hover:border-green-300'
                            : 'bg-gray-100 border border-gray-100'
                      }`}
                    >
                      <div className="text-2xl mb-1">{CROWN_EMOJI[level]}</div>
                      <p className="text-[10px] font-bold text-gray-600">
                        {CROWN_NAMES[level]}
                      </p>
                      {completed && (
                        <CheckCircle className="w-3 h-3 text-green-500 mx-auto mt-1" />
                      )}
                      {!crownUnlocked && (
                        <Lock className="w-3 h-3 text-gray-400 mx-auto mt-1" />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
