'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { RARITY_STYLES } from '@/lib/avatar/constants'
import type { AvatarItem } from '@/types'
import { cn } from '@/lib/utils'

interface ItemCardProps {
  item: AvatarItem
  equipped: boolean
  owned: boolean
  selected: boolean
  onSelect: () => void
  onEquip: () => void
}

export default function ItemCard({
  item,
  equipped,
  owned,
  selected,
  onSelect,
  onEquip,
}: ItemCardProps) {
  const rarity = RARITY_STYLES[item.rarity]

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={owned ? onEquip : onSelect}
      className={cn(
        `relative flex flex-col items-center p-3 rounded-xl border-2 transition-all`,
        rarity.border,
        rarity.bg,
        equipped && 'ring-2 ring-[#58CC02] ring-offset-2',
        !owned && 'opacity-50 grayscale',
        selected && !equipped && 'ring-2 ring-blue-400 ring-offset-2 opacity-80'
      )}
    >
      {equipped && (
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#58CC02] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      <div className="w-16 h-16 rounded-lg bg-white/60 flex items-center justify-center mb-2">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-14 h-14 object-contain"
        />
      </div>

      <span className={cn('text-xs font-semibold text-center leading-tight', rarity.text)}>
        {item.name}
      </span>

      <span className="text-[10px] text-gray-500 mt-0.5">{rarity.label}</span>

      {!owned && item.price_gems > 0 && (
        <span className="text-[10px] font-semibold text-blue-500 mt-0.5">
          💎 {item.price_gems}
        </span>
      )}
      {!owned && item.price_lawcoins > 0 && (
        <span className="text-[10px] font-semibold text-amber-500 mt-0.5">
          ⚖️ {item.price_lawcoins}
        </span>
      )}
    </motion.button>
  )
}
