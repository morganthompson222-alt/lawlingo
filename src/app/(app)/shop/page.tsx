'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Gem, Scale, ChevronLeft, Search
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/store/user'
import { SLOT_DEFINITIONS, RARITY_STYLES, RARITY_ORDER } from '@/lib/avatar/constants'
import { cn } from '@/lib/utils'
import PurchaseModal from '@/components/shop/PurchaseModal'
import { LAWCOIN_PACKAGES } from '@/types'
import type { AvatarSlotType, AvatarRarity, AvatarItem } from '@/types'

type ShopView = 'items' | 'lawcoins'

export default function ShopPage() {
  const { profile, setProfile } = useUserStore()
  const [items, setItems] = useState<AvatarItem[]>([])
  const [ownedItemIds, setOwnedItemIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // Filters
  const [filterType, setFilterType] = useState<AvatarSlotType | 'all'>('all')
  const [filterRarity, setFilterRarity] = useState<AvatarRarity | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Purchase
  const [selectedItem, setSelectedItem] = useState<AvatarItem | null>(null)
  const [purchaseCurrency, setPurchaseCurrency] = useState<'gems' | 'lawcoins'>('gems')

  // Shop view
  const [shopView, setShopView] = useState<ShopView>('items')

  const supabase = createClient()
  const gems = profile?.gems || 0
  const lawcoins = profile?.lawcoins || 0

  useEffect(() => {
    async function loadData() {
      const [{ data: itemsData }, { data: userItems }] = await Promise.all([
        supabase.from('items').select('*'),
        profile ? supabase.from('user_items').select('item_id').eq('user_id', profile.id) : Promise.resolve({ data: null }),
      ])

      if (itemsData) setItems(itemsData as AvatarItem[])
      if (userItems) setOwnedItemIds(new Set((userItems as { item_id: string }[]).map((ui) => ui.item_id)))
      setLoading(false)
    }
    loadData()
  }, [profile, supabase])

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (filterRarity !== 'all' && item.rarity !== filterRarity) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleBuy = async () => {
    if (!selectedItem) return

    const price = purchaseCurrency === 'gems' ? selectedItem.price_gems : selectedItem.price_lawcoins
    const balance = purchaseCurrency === 'gems' ? gems : lawcoins

    if (balance < price) {
      toast.error('Insufficient funds!')
      return
    }

    const res = await fetch('/api/shop/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_id: selectedItem.id,
        currency: purchaseCurrency,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Purchase failed')
      return
    }

    const data = await res.json()

    // Update local state
    setOwnedItemIds((prev) => new Set([...prev, selectedItem.id]))
    if (profile) {
      if (purchaseCurrency === 'gems') {
        setProfile({ ...profile, gems: data.new_balance })
      } else {
        setProfile({ ...profile, lawcoins: data.new_balance })
      }
    }

    setSelectedItem(null)
    toast.success(`${selectedItem.name} purchased!`, { icon: '🎉' })
  }

  const handleBuyLawCoins = async (packageId: string) => {
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      })

      if (!res.ok) {
        toast.error('Failed to start checkout')
        return
      }

      const { url } = await res.json()
      if (url) {
        window.location.assign(url)
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  const openPurchase = (item: AvatarItem) => {
    if (ownedItemIds.has(item.id)) return

    if (item.price_gems > 0) {
      setPurchaseCurrency('gems')
    } else if (item.price_lawcoins > 0) {
      setPurchaseCurrency('lawcoins')
    } else {
      // Free item - just claim it
      handleClaimFreeItem(item)
      return
    }
    setSelectedItem(item)
  }

  const handleClaimFreeItem = async (item: AvatarItem) => {
    const res = await fetch('/api/shop/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: item.id, currency: 'gems' }),
    })

    if (res.ok) {
      setOwnedItemIds((prev) => new Set([...prev, item.id]))
      toast.success(`${item.name} claimed!`, { icon: '🎁' })
    } else {
      toast.error('Failed to claim item')
    }
  }

  const switchCurrency = () => {
    setPurchaseCurrency((prev) => (prev === 'gems' ? 'lawcoins' : 'gems'))
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/avatar" className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Avatar</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-sm font-semibold text-blue-600">
            <Gem className="w-4 h-4" /> {gems}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
            <Scale className="w-4 h-4" /> {lawcoins}
          </span>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setShopView('items')}
          className={cn(
            'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
            shopView === 'items' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
          )}
        >
          <ShoppingBag className="w-4 h-4 inline mr-1" />
          Items
        </button>
        <button
          onClick={() => setShopView('lawcoins')}
          className={cn(
            'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
            shopView === 'lawcoins' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
          )}
        >
          <Scale className="w-4 h-4 inline mr-1" />
          LawCoins
        </button>
      </div>

      {shopView === 'lawcoins' ? (
        /* ─── LawCoin Store ─── */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Buy LawCoins</h2>
          <p className="text-sm text-gray-500 mb-6">
            LawCoins unlock exclusive premium avatar items. Purchase a pack to enhance your character.
          </p>
          <div className="space-y-3">
            {LAWCOIN_PACKAGES.map((pkg) => (
              <motion.button
                key={pkg.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBuyLawCoins(pkg.id)}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all',
                  pkg.popular
                    ? 'border-amber-400 bg-amber-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#58CC02]/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    pkg.popular ? 'bg-amber-400 text-white' : 'bg-gray-100'
                  )}>
                    <Scale className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{pkg.name}</p>
                    <p className="text-sm text-gray-500">{pkg.amount} LawCoins</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${pkg.price_usd}</p>
                  {pkg.popular && (
                    <span className="text-xs text-amber-600 font-semibold">Popular</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-6">
            Secure payment via Stripe. LawCoins are added instantly after payment.
          </p>
        </motion.div>
      ) : (
        /* ─── Item Shop ─── */
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#58CC02]/30 focus:border-[#58CC02]"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                filterType === 'all' ? 'bg-[#58CC02] text-white' : 'bg-white border border-gray-200 text-gray-600'
              )}
            >
              All Types
            </button>
            {(Object.entries(SLOT_DEFINITIONS) as [AvatarSlotType, typeof SLOT_DEFINITIONS[AvatarSlotType]][]).map(([slot, def]) => {
              const Icon = def.icon
              return (
                <button
                  key={slot}
                  onClick={() => setFilterType(slot)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                    filterType === slot ? 'bg-[#58CC02] text-white' : 'bg-white border border-gray-200 text-gray-600'
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {def.label}
                </button>
              )
            })}
          </div>

          {/* Rarity Filter */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            <button
              onClick={() => setFilterRarity('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                filterRarity === 'all' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600'
              )}
            >
              All Rarities
            </button>
            {RARITY_ORDER.map((rarity) => (
              <button
                key={rarity}
                onClick={() => setFilterRarity(rarity)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-all',
                  filterRarity === rarity
                    ? `${RARITY_STYLES[rarity].bg} ${RARITY_STYLES[rarity].text} border ${RARITY_STYLES[rarity].border}`
                    : 'bg-white border border-gray-200 text-gray-600'
                )}
              >
                {rarity}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-8 h-8 border-3 border-[#58CC02] border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => {
                  const owned = ownedItemIds.has(item.id)
                  const ra = RARITY_STYLES[item.rarity]
                  return (
                    <motion.button
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openPurchase(item)}
                      className={cn(
                        'relative flex flex-col items-center p-3 rounded-xl border-2 transition-all',
                        ra.border,
                        ra.bg,
                        owned && 'ring-2 ring-[#58CC02] ring-offset-1',
                        !owned && 'hover:shadow-md'
                      )}
                    >
                      {owned && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#58CC02] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">✓</span>
                        </div>
                      )}

                      <div className="w-16 h-16 rounded-xl bg-white/70 flex items-center justify-center mb-2">
                        <img src={item.image_url} alt={item.name} className="w-14 h-14 object-contain" />
                      </div>

                      <span className="text-xs font-semibold text-center leading-tight text-gray-900">
                        {item.name}
                      </span>

                      <span className={cn('text-[10px] mt-0.5', ra.text)}>{ra.label}</span>

                      {!owned && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {item.price_gems > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                              <Gem className="w-2.5 h-2.5" /> {item.price_gems}
                            </span>
                          )}
                          {item.price_lawcoins > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                              <Scale className="w-2.5 h-2.5" /> {item.price_lawcoins}
                            </span>
                          )}
                          {item.price_gems === 0 && item.price_lawcoins === 0 && (
                            <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                              FREE
                            </span>
                          )}
                        </div>
                      )}

                      {owned && (
                        <span className="text-[10px] text-[#58CC02] font-semibold mt-1">Owned</span>
                      )}
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No items match your filters</p>
            </div>
          )}
        </>
      )}

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={!!selectedItem}
        item={selectedItem}
        currency={purchaseCurrency}
        balance={purchaseCurrency === 'gems' ? gems : lawcoins}
        onClose={() => setSelectedItem(null)}
        onConfirm={handleBuy}
        onSwitchCurrency={switchCurrency}
      />
    </div>
  )
}
