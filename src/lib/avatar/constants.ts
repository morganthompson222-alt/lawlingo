import type { AvatarSlotType, AvatarRarity } from '@/types'
import { Shirt, Crown, Glasses, Watch, Image, Cat, Smile, User, Footprints } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Rendering z-order — lowest to highest
export const AVATAR_Z_ORDER: AvatarSlotType[] = [
  'background',
  'pet',
  'base',
  'clothing_bottom',
  'clothing_top',
  'facial',
  'hair',
  'accessory',
  'emote',
]

// Display labels + icons for each slot
export const SLOT_DEFINITIONS: Record<AvatarSlotType, { label: string; icon: LucideIcon }> = {
  base: { label: 'Base', icon: User },
  hair: { label: 'Hair', icon: Crown },
  facial: { label: 'Facial', icon: Glasses },
  clothing_top: { label: 'Top', icon: Shirt },
  clothing_bottom: { label: 'Bottom', icon: Footprints },
  accessory: { label: 'Accessory', icon: Watch },
  background: { label: 'Background', icon: Image },
  pet: { label: 'Pet', icon: Cat },
  emote: { label: 'Emote', icon: Smile },
}

// Rarity styling
export const RARITY_STYLES: Record<AvatarRarity, { bg: string; text: string; border: string; glow: string; label: string }> = {
  common: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-300',
    glow: '',
    label: 'Common',
  },
  rare: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-400',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.4)]',
    label: 'Rare',
  },
  epic: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-400',
    glow: 'shadow-[0_0_12px_rgba(147,51,234,0.5)]',
    label: 'Epic',
  },
  legendary: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-400',
    glow: 'shadow-[0_0_16px_rgba(245,158,11,0.6)]',
    label: 'Legendary',
  },
  mythic: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-400',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.6)]',
    label: 'Mythic',
  },
}

export const RARITY_ORDER: AvatarRarity[] = ['common', 'rare', 'epic', 'legendary', 'mythic']

export function getRarityValue(rarity: AvatarRarity): number {
  return RARITY_ORDER.indexOf(rarity)
}
