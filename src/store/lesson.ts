import { create } from 'zustand'

interface LessonState {
  currentLessonId: string | null
  hearts: number
  mistakes: number
  correctCount: number
  currentQuestionIndex: number
  totalQuestions: number
  lessonStartedAt: number | null
  isComplete: boolean

  startLesson: (lessonId: string, totalQuestions: number) => void
  recordAnswer: (correct: boolean) => void
  nextQuestion: () => void
  endLesson: () => { score: number; correctCount: number; total: number; timeSeconds: number }
  reset: () => void
}

export const useLessonStore = create<LessonState>()((set, get) => ({
  currentLessonId: null,
  hearts: 5,
  mistakes: 0,
  correctCount: 0,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  lessonStartedAt: null,
  isComplete: false,

  startLesson: (lessonId, totalQuestions) =>
    set({
      currentLessonId: lessonId,
      hearts: 5,
      mistakes: 0,
      correctCount: 0,
      currentQuestionIndex: 0,
      totalQuestions,
      lessonStartedAt: Date.now(),
      isComplete: false,
    }),

  recordAnswer: (correct) => {
    const state = get()
    if (correct) {
      set({ correctCount: state.correctCount + 1 })
    } else {
      const newHearts = state.hearts - 1
      set({ hearts: newHearts, mistakes: state.mistakes + 1 })
    }
  },

  nextQuestion: () => {
    const state = get()
    const nextIndex = state.currentQuestionIndex + 1
    if (nextIndex >= state.totalQuestions || state.hearts <= 0) {
      set({ isComplete: true })
    } else {
      set({ currentQuestionIndex: nextIndex })
    }
  },

  endLesson: () => {
    const state = get()
    const timeSeconds = state.lessonStartedAt
      ? Math.round((Date.now() - state.lessonStartedAt) / 1000)
      : 0
    const score = state.totalQuestions > 0
      ? Math.round((state.correctCount / state.totalQuestions) * 100)
      : 0

    set({ isComplete: true })
    return { score, correctCount: state.correctCount, total: state.totalQuestions, timeSeconds }
  },

  reset: () =>
    set({
      currentLessonId: null,
      hearts: 5,
      mistakes: 0,
      correctCount: 0,
      currentQuestionIndex: 0,
      totalQuestions: 0,
      lessonStartedAt: null,
      isComplete: false,
    }),
}))
