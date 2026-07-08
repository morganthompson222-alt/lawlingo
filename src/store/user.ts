import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, CrownProgress, AvatarConfig } from '@/types'

interface UserStore {
  profile: UserProfile | null
  crowns: CrownProgress[]
  setProfile: (profile: UserProfile) => void
  addXP: (amount: number) => void
  addGems: (amount: number) => void
  spendGems: (amount: number) => boolean
  addLawCoins: (amount: number) => void
  spendLawCoins: (amount: number) => boolean
  deductHeart: () => void
  refillHearts: () => void
  setCrownCompleted: (page: string, level: number) => void
  isCrownUnlocked: (page: string, level: number) => boolean
  updateAvatarConfig: (config: AvatarConfig) => void
  equipItem: (slot: string, itemId: string | null) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      crowns: [],

      setProfile: (profile) => set({ profile }),

      addXP: (amount) =>
        set((s) => ({
          profile: s.profile ? { ...s.profile, xp: s.profile.xp + amount } : null,
        })),

      addGems: (amount) =>
        set((s) => ({
          profile: s.profile ? { ...s.profile, gems: s.profile.gems + amount } : null,
        })),

      spendGems: (amount) => {
        const { profile } = get()
        if (!profile || profile.gems < amount) return false
        set({ profile: { ...profile, gems: profile.gems - amount } })
        return true
      },

      addLawCoins: (amount) =>
        set((s) => ({
          profile: s.profile ? { ...s.profile, lawcoins: (s.profile.lawcoins || 0) + amount } : null,
        })),

      spendLawCoins: (amount) => {
        const { profile } = get()
        if (!profile || (profile.lawcoins || 0) < amount) return false
        set({ profile: { ...profile, lawcoins: (profile.lawcoins || 0) - amount } })
        return true
      },

      deductHeart: () =>
        set((s) => ({
          profile: s.profile ? { ...s.profile, hearts: Math.max(0, s.profile.hearts - 1) } : null,
        })),

      refillHearts: () =>
        set((s) => ({
          profile: s.profile ? { ...s.profile, hearts: 5 } : null,
        })),

      setCrownCompleted: (page, level) => {
        const { crowns } = get()
        const exists = crowns.find((c) => c.page === page && c.level === level)
        if (exists) {
          set({
            crowns: crowns.map((c) =>
              c.page === page && c.level === level ? { ...c, completed: true } : c
            ),
          })
        } else {
          set({
            crowns: [...crowns, { page, level, completed: true, locked: false }],
          })
        }
      },

      isCrownUnlocked: (page, level) => {
        const { crowns } = get()
        if (level === 1) return true
        const prevCrown = crowns.find((c) => c.page === page && c.level === level - 1)
        return prevCrown?.completed ?? false
      },

      updateAvatarConfig: (config) =>
        set((s) => ({
          profile: s.profile ? { ...s.profile, avatar_config: config } : null,
        })),

      equipItem: (slot, itemId) =>
        set((s) => {
          if (!s.profile) return s
          const config = { ...s.profile.avatar_config }
          const key = slot as keyof AvatarConfig
          if (key in config) {
            config[key] = itemId
          }
          return { profile: { ...s.profile, avatar_config: config } }
        }),
    }),
    { name: 'lawlingo-user' }
  )
)
