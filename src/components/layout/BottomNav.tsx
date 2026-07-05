'use client'

import Link from 'next/link'
import { Home, BookOpen, Trophy, Swords, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/skill-tree', icon: BookOpen, label: 'Learn' },
  { href: '/practice', icon: Swords, label: 'Practice' },
  { href: '/leaderboard', icon: Trophy, label: 'Leagues' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-5xl mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                active ? 'text-[#58CC02]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className={`w-6 h-6 ${active ? 'fill-[#58CC02]/10' : ''}`} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
