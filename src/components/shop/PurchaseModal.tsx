'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Gem, Scale, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AvatarItem } from '@/types'

interface PurchaseModalProps {
  isOpen: boolean
  item: AvatarItem | null
  currency: 'gems' | 'lawcoins'
  balance: number
  onClose: () => void
  onConfirm: () => void
  onSwitchCurrency: () => void
}

export default function PurchaseModal({
  isOpen,
  item,
  currency,
  balance,
  onClose,
  onConfirm,
  onSwitchCurrency,
}: PurchaseModalProps) {
  if (!item) return null

  const price = currency === 'gems' ? item.price_gems : item.price_lawcoins
  const canAfford = balance >= price
  const otherCurrency = currency === 'gems' ? 'lawcoins' : 'gems'
  const otherPrice = currency === 'gems' ? item.price_lawcoins : item.price_gems

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            {/* Item preview */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-contain" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{item.rarity}</p>
            </div>

            {/* Price and balance */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Price</span>
                <span className="flex items-center gap-1.5 font-bold">
                  {currency === 'gems' ? (
                    <Gem className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Scale className="w-4 h-4 text-amber-600" />
                  )}
                  {price}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Your balance</span>
                <span className={cn('font-semibold', canAfford ? 'text-green-600' : 'text-red-500')}>
                  {balance}
                </span>
              </div>
            </div>

            {!canAfford && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-4">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Not enough {currency === 'gems' ? 'Gems' : 'LawCoins'}!
              </div>
            )}

            {/* Switch currency if available */}
            {otherPrice > 0 && (
              <button
                onClick={onSwitchCurrency}
                className="w-full text-center text-sm text-gray-500 hover:text-[#58CC02] mb-3 transition-colors"
              >
                Buy with {otherCurrency === 'gems' ? '💎 Gems' : '⚖️ LawCoins'} ({otherPrice})
              </button>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                disabled={!canAfford}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-colors',
                  canAfford
                    ? 'bg-[#58CC02] hover:bg-[#46A302] shadow-[0_4px_0_#46A302] active:shadow-none active:translate-y-[2px]'
                    : 'bg-gray-300 cursor-not-allowed'
                )}
              >
                {canAfford ? 'Confirm Purchase' : `Need ${price - balance} more`}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
