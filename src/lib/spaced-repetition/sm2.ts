// SM-2 Spaced Repetition Algorithm Implementation
// Based on the SuperMemo SM-2 algorithm specified in progression-system.md

export interface SM2Result {
  easiness: number
  interval: number
  nextReview: Date
}

export function calculateSM2(
  currentEasiness: number,
  currentInterval: number,
  quality: number // 0-5 scale
): SM2Result {
  // Clamp quality
  const q = Math.max(0, Math.min(5, quality))

  // Calculate new easiness factor
  let newEF = currentEasiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  // EF cannot go below 1.3
  if (newEF < 1.3) newEF = 1.3

  // Calculate new interval
  let newInterval: number
  if (q < 3) {
    // Failed — reset interval
    newInterval = 1
  } else {
    if (currentInterval === 0) {
      newInterval = 1
    } else if (currentInterval === 1) {
      newInterval = 3
    } else {
      newInterval = Math.round(currentInterval * newEF)
    }
  }

  // Calculate next review date
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    easiness: newEF,
    interval: newInterval,
    nextReview,
  }
}

export function getQualityFromResponse(
  correct: boolean,
  hesitation: boolean,
  seriousDoubt: boolean
): number {
  if (correct && !hesitation) return 5    // perfect
  if (correct && hesitation) return 4     // correct with hesitation
  if (correct && seriousDoubt) return 3   // correct with serious doubt
  if (!correct && !seriousDoubt) return 2 // incorrect but understood on reflection
  if (!correct && seriousDoubt) return 1  // incorrect, vaguely recalled
  return 0                                 // complete blackout
}

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 90]
