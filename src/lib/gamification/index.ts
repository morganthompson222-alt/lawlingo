import type { League } from '@/types'
import { LEAGUE_ORDER } from '@/types'

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1
}

export function xpForNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp)
  return currentLevel * 500
}

export function xpProgressInLevel(xp: number): number {
  return xp % 500
}

export function calculateLessonXP(
  streak: number,
  speedSeconds: number
): { base: number; streak: number; speed: number; total: number } {
  const base = 10
  const streakBonus = streak >= 7 ? 5 : 0
  const speedBonus = speedSeconds < 30 ? 2 : 0
  return { base, streak: streakBonus, speed: speedBonus, total: base + streakBonus + speedBonus }
}

export function getLeaguePromotion(current: League): League | null {
  const idx = LEAGUE_ORDER.indexOf(current)
  if (idx === LEAGUE_ORDER.length - 1) return null
  return LEAGUE_ORDER[idx + 1]
}

export function getLeagueDemotion(current: League): League | null {
  const idx = LEAGUE_ORDER.indexOf(current)
  if (idx === 0) return null
  return LEAGUE_ORDER[idx - 1]
}

export const BADGE_DEFINITIONS = [
  { name: 'First Lesson', description: 'Complete your first lesson', xp: 0 },
  { name: '7-Day Streak', description: 'Maintain a 7-day streak', xp: 50 },
  { name: '30-Day Streak', description: 'Maintain a 30-day streak', xp: 200 },
  { name: 'Bronze Crown', description: 'Earn a Bronze Crown on any page', xp: 25 },
  { name: 'Diamond Crown', description: 'Earn a Diamond Crown on any page', xp: 500 },
  { name: 'Loopholes Explorer', description: 'Pass the Loopholes Entrance Test', xp: 100 },
  { name: 'Contract Drafter', description: 'Complete Page A (Contract Law)', xp: 200 },
  { name: 'Tort Avenger', description: 'Complete Page B (Tort)', xp: 200 },
  { name: 'Homicide Specialist', description: 'Complete Page C (Criminal Homicide)', xp: 200 },
  { name: 'Financial Crime Buster', description: 'Complete Page D (Financial Crime)', xp: 200 },
  { name: 'Master of Loopholes', description: 'Complete Page H (Loopholes Mastery)', xp: 500 },
  { name: 'Grandmaster', description: 'Complete all 10 pages', xp: 1000 },
]

export const GEM_COSTS = {
  streakFreeze: 50,
  heartRefill: 30,
  avatarFrame: 200,
} as const
