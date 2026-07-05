'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  user_id: string
  weekly_xp: number
  league: string
  rank?: number
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/leaderboard')
        if (res.ok) {
          const data = await res.json()
          setEntries(data.map((e: LeaderboardEntry, i: number) => ({ ...e, rank: i + 1 })))
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const tiers = [
    { from: 1, to: 3, color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' },
    { from: 4, to: 7, color: 'bg-gray-50 border-gray-200', text: 'text-gray-700' },
    { from: 8, to: 20, color: 'bg-amber-50/50 border-amber-100', text: 'text-amber-700' },
  ]

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Weekly League</h1>
          <p className="text-sm text-gray-500">Top 7 promote, bottom 5 demote</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-500 mb-2">No rankings yet</h2>
          <p className="text-gray-400">Start learning to appear on the leaderboard!</p>
        </div>
      ) : (
        <motion.div className="space-y-2">
          {entries.map((entry, i) => {
            const tier = tiers.find((t) => i + 1 >= t.from && i + 1 <= t.to)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`${tier?.color} rounded-xl p-4 border flex items-center gap-3`}
              >
                <span className={`text-lg font-extrabold w-8 ${tier?.text}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Player {entry.user_id.slice(0, 6)}</p>
                  <p className="text-xs text-gray-500">{entry.league} league</p>
                </div>
                <span className="font-bold text-gray-900">{entry.weekly_xp} XP</span>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
