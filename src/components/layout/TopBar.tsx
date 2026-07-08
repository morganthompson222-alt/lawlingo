'use client'

import { Heart, Gem, Flame, Scale, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/store/user'
import { useEffect } from 'react'

export default function TopBar() {
  const { profile, setProfile } = useUserStore()

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/progress')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    }
    if (!profile) loadProfile()
  }, [profile, setProfile])

  if (!profile) return null

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-[#58CC02]">LawLingo</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{profile.streak}</span>
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold">
            <Gem className="w-4 h-4 text-blue-500" />
            <span>{profile.gems}</span>
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>{profile.lawcoins || 0}</span>
          </div>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < profile.hearts ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <Link
            href="/avatar"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-[#58CC02] flex items-center justify-center text-white"
            title="Avatar Editor"
          >
            <UserCircle className="w-5 h-5" />
          </Link>

          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold"
          >
            {profile.xp ? Math.floor(profile.xp / 500) + 1 : '1'}
          </Link>
        </div>
      </div>
    </header>
  )
}
