'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Eye, EyeOff, ChevronLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/store/user'
import { AVATAR_Z_ORDER, SLOT_DEFINITIONS } from '@/lib/avatar/constants'
import { cn } from '@/lib/utils'
import AvatarComposer from '@/components/avatar/AvatarComposer'
import ItemCard from '@/components/avatar/ItemCard'
import type { AvatarSlotType, AvatarItem, AvatarConfig } from '@/types'

export default function AvatarEditorPage() {
  const { profile, equipItem } = useUserStore()
  const [selectedSlot, setSelectedSlot] = useState<AvatarSlotType>('base')
  const [shopItems, setShopItems] = useState<AvatarItem[]>([])
  const [ownedItemIds, setOwnedItemIds] = useState<Set<string>>(new Set())
  const [showUnowned, setShowUnowned] = useState(false)
  const [previewConfig, setPreviewConfig] = useState<AvatarConfig | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const config = previewConfig || profile?.avatar_config || {
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

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const [{ data: items }, { data: userItems }] = await Promise.all([
        supabase.from('items').select('*'),
        profile ? supabase.from('user_items').select('item_id').eq('user_id', profile.id) : Promise.resolve({ data: null }),
      ])

      if (items) setShopItems(items as AvatarItem[])
      if (userItems) setOwnedItemIds(new Set((userItems as { item_id: string }[]).map((ui) => ui.item_id)))
    }
    loadData()
  }, [profile, supabase])

  const handlePreviewItem = (item: AvatarItem) => {
    setPreviewConfig({
      ...config,
      [item.type]: item.id,
    })
  }

  const handleEquipItem = async (item: AvatarItem) => {
    if (!ownedItemIds.has(item.id)) {
      setPreviewConfig(null)
      return
    }

    equipItem(item.type, item.id)
    setPreviewConfig(null)
    toast.success(`${item.name} equipped!`, { icon: '✨' })
  }

  const handleUnequip = (slot: AvatarSlotType) => {
    if (slot === 'base') return
    equipItem(slot, null)
    setPreviewConfig(null)
    toast.success(`${SLOT_DEFINITIONS[slot].label} unequipped`)
  }

  const handleSave = async () => {
    if (!profile) return
    setIsSaving(true)

    const res = await fetch('/api/avatar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: profile.avatar_config }),
    })

    if (res.ok) {
      toast.success('Avatar saved!')
    } else {
      toast.error('Failed to save avatar')
    }
    setIsSaving(false)
  }

  const imageUrls: Record<string, string> = {}
  shopItems.forEach((item) => {
    imageUrls[item.id] = item.image_url
  })

  const slotItems = shopItems.filter((item) => item.type === selectedSlot)
  const ownedForSlot = slotItems.filter((i) => ownedItemIds.has(i.id))
  const unownedForSlot = slotItems.filter((i) => !ownedItemIds.has(i.id))

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#58CC02] text-white text-sm font-semibold hover:bg-[#46A302] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Avatar Preview */}
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#58CC02]/10 to-blue-500/10 blur-3xl" />
          <AvatarComposer config={config} size={224} animate imageUrls={imageUrls} />
        </motion.div>
      </div>

      {/* Slot Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {AVATAR_Z_ORDER.map((slot) => {
          const Icon = SLOT_DEFINITIONS[slot].icon
          const isActive = selectedSlot === slot
          const equippedId = config[slot]
          return (
            <motion.button
              key={slot}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedSlot(slot)
                setPreviewConfig(null)
                setShowUnowned(false)
              }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'bg-[#58CC02] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="w-4 h-4" />
              {SLOT_DEFINITIONS[slot].label}
              {equippedId && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#58CC02]" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Preview toggle */}
      {unownedForSlot.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">
            {SLOT_DEFINITIONS[selectedSlot].label}
          </h3>
          <button
            onClick={() => setShowUnowned(!showUnowned)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
          >
            {showUnowned ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showUnowned ? 'Hide unowned' : 'Show all'}
          </button>
        </div>
      )}

      {/* Currently equipped or empty state */}
      {config[selectedSlot] && (() => {
        const equippedItem = shopItems.find((i) => i.id === config[selectedSlot])
        return (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <img
              src={equippedItem?.image_url || `/avatars/${config[selectedSlot]}.svg`}
              alt="equipped"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-green-800 font-medium">Currently Equipped</p>
            <p className="text-sm font-semibold text-green-900">
              {equippedItem?.name || config[selectedSlot]}
            </p>
          </div>
          <button
            onClick={() => handleUnequip(selectedSlot)}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
        )
      })()}

      {/* Owned Items */}
      <div className="mb-6">
        {ownedForSlot.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {ownedForSlot.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <ItemCard
                    item={item}
                    equipped={config[selectedSlot] === item.id && !previewConfig}
                    owned={true}
                    selected={previewConfig?.[selectedSlot] === item.id}
                    onSelect={() => handlePreviewItem(item)}
                    onEquip={() => handleEquipItem(item)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No items for this slot</p>
            <Link href="/shop" className="text-xs text-[#58CC02] font-medium hover:underline mt-1 inline-block">
              Visit Shop
            </Link>
          </div>
        )}
      </div>

      {/* Unowned Items Preview */}
      {showUnowned && unownedForSlot.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Available in Shop</h4>
          <div className="grid grid-cols-4 gap-3">
            {unownedForSlot.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ItemCard
                  item={item}
                  equipped={false}
                  owned={false}
                  selected={previewConfig?.[selectedSlot] === item.id}
                  onSelect={() => handlePreviewItem(item)}
                  onEquip={() => {}}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
