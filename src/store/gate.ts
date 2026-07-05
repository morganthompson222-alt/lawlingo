import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GateState {
  cooldowns: Record<string, number> // key: "page-crownLevel", value: cooldown end timestamp
  setCooldown: (page: string, level: number) => void
  checkCooldown: (page: string, level: number) => boolean
  getCooldownEnd: (page: string, level: number) => number | null
}

export const useGateStore = create<GateState>()(
  persist(
    (set, get) => ({
      cooldowns: {},

      setCooldown: (page, level) => {
        const key = `${page}-${level}`
        const end = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        set({ cooldowns: { ...get().cooldowns, [key]: end } })
      },

      checkCooldown: (page, level) => {
        const key = `${page}-${level}`
        const timestamp = get().cooldowns[key]
        if (!timestamp) return false
        if (Date.now() > timestamp) {
          const { [key]: _, ...rest } = get().cooldowns
          set({ cooldowns: rest })
          return false
        }
        return true
      },

      getCooldownEnd: (page, level) => {
        const key = `${page}-${level}`
        return get().cooldowns[key] ?? null
      },
    }),
    { name: 'lawlingo-gates' }
  )
)
