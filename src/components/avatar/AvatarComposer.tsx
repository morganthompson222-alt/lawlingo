'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { AVATAR_Z_ORDER } from '@/lib/avatar/constants'
import type { AvatarConfig } from '@/types'

interface AvatarComposerProps {
  config: AvatarConfig
  size?: number
  className?: string
  animate?: boolean
  imageUrls?: Record<string, string>
}

export default function AvatarComposer({
  config,
  size = 256,
  className = '',
  animate = true,
  imageUrls = {},
}: AvatarComposerProps) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {AVATAR_Z_ORDER.map((slot) => {
        const itemId = config[slot]
        if (!itemId) return null

        const src = imageUrls[itemId] || `/avatars/${itemId}.svg`

        const Wrapper = animate ? motion.div : 'div'

        return (
          <Wrapper
            key={slot}
            initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
            animate={animate ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={itemId}
              width={size}
              height={size}
              className="pointer-events-none select-none"
              priority={slot === 'base'}
              unoptimized
            />
          </Wrapper>
        )
      })}
    </div>
  )
}
