export interface Question {
  id: string
  page: string
  section: string
  micro_skill: string
  crown_level: number
  type: 'mcq' | 'msq' | 'tf' | 'scenario' | 'drag_match' | 'fill_blank' | 'drafting'
  loophole: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  question: string
  options: QuestionOption[]
  feedback: string
  oscoa_references: string[]
}

export interface QuestionOption {
  id: string
  text: string
  correct: boolean
  feedback: string
}

export interface UserProfile {
  id: string
  xp: number
  gems: number
  lawcoins: number
  streak: number
  last_active: string | null
  league: League
  hearts: number
  streak_freeze: boolean
  avatar_config: AvatarConfig
}

export type League = 'bronze' | 'silver' | 'gold' | 'sapphire' | 'ruby' | 'emerald' | 'diamond'

export interface LessonAttempt {
  id: string
  user_id: string
  lesson_id: string
  score: number
  mistakes: Record<string, boolean>
  completed: boolean
  created_at: string
}

export interface GateAttempt {
  id: string
  user_id: string
  page: string
  crown_level: number
  score: number
  passed: boolean
  created_at: string
}

export interface ReviewCard {
  id: string
  user_id: string
  micro_skill: string
  easiness: number
  interval: number
  next_review: string
  last_review: string
}

export interface Badge {
  id: string
  user_id: string
  name: string
  earned_at: string
}

export interface CrownProgress {
  page: string
  level: number
  completed: boolean
  locked: boolean
}

export interface StoryScene {
  id: number
  character: string
  dialogue: string
  side?: 'left' | 'right'
  question?: Question
  choices?: { text: string; nextScene: number }[]
}

export interface Story {
  id: string
  page: string
  title: string
  scenes: StoryScene[]
}

// ──────────────── Avatar System Types ────────────────

export type AvatarSlotType = 'base' | 'hair' | 'facial' | 'clothing_top' | 'clothing_bottom' | 'accessory' | 'background' | 'pet' | 'emote'

export type AvatarRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'

export interface AvatarItem {
  id: string
  type: AvatarSlotType
  rarity: AvatarRarity
  price_gems: number
  price_lawcoins: number
  name: string
  image_url: string
}

export interface AvatarConfig {
  base: string | null
  hair: string | null
  facial: string | null
  clothing_top: string | null
  clothing_bottom: string | null
  accessory: string | null
  background: string | null
  pet: string | null
  emote: string | null
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  base: 'base_default',
  hair: null,
  facial: null,
  clothing_top: null,
  clothing_bottom: null,
  accessory: null,
  background: null,
  pet: null,
  emote: null,
}

// LawCoin packages for Stripe checkout
export interface LawCoinPackage {
  id: string
  name: string
  amount: number
  price_usd: number
  popular?: boolean
}

export const LAWCOIN_PACKAGES: LawCoinPackage[] = [
  { id: 'small', name: 'Small Pouch', amount: 100, price_usd: 2.99 },
  { id: 'medium', name: 'Silver Bag', amount: 500, price_usd: 9.99, popular: true },
  { id: 'large', name: 'Gold Chest', amount: 1200, price_usd: 19.99 },
  { id: 'mega', name: 'Diamond Vault', amount: 5000, price_usd: 49.99 },
]

// ──────────────── Existing Constants ────────────────

export const LEAGUE_ORDER: League[] = ['bronze', 'silver', 'gold', 'sapphire', 'ruby', 'emerald', 'diamond']

export const CROWN_NAMES: Record<number, string> = {
  1: 'Bronze',
  2: 'Silver',
  3: 'Gold',
  4: 'Platinum',
  5: 'Diamond',
}

export const CROWN_EMOJI: Record<number, string> = {
  1: '🥉',
  2: '🥈',
  3: '🥇',
  4: '💎',
  5: '👑',
}

export const PAGE_NAMES: Record<string, string> = {
  A: 'Contract Law',
  B: 'Tort & Civil Wrongs',
  C: 'Criminal – Homicide',
  D: 'Criminal – Financial',
  E: 'Civil‑Criminal Overlap',
  F: 'Tax & Offshore',
  G: 'Money Laundering',
  H: 'Loopholes & Defensive Lawyering',
  I: 'Civil Procedure',
  J: 'Criminal Procedure',
}

export const PAGE_EMOJI: Record<string, string> = {
  A: '📜',
  B: '⚖️',
  C: '🔪',
  D: '💰',
  E: '🔀',
  F: '🏦',
  G: '🕵️',
  H: '🔓',
  I: '🏛️',
  J: '🚔',
}
