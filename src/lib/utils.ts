import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function getPageKey(name: string): string {
  const keys: Record<string, string> = {
    'Contract Law': 'A',
    'Tort & Civil Wrongs': 'B',
    'Criminal – Homicide': 'C',
    'Criminal – Financial': 'D',
    'Civil‑Criminal Overlap': 'E',
    'Tax & Offshore': 'F',
    'Money Laundering': 'G',
    'Loopholes & Defensive Lawyering': 'H',
    'Civil Procedure': 'I',
    'Criminal Procedure': 'J',
  }
  return keys[name] ?? name
}

export const COLOURS = {
  primary: '#58CC02',
  primaryDark: '#46A302',
  danger: '#FF4B4B',
  warning: '#FFC800',
  navy: '#1C1D21',
  grey: '#E5E5E5',
  greyDark: '#7C7C7C',
}
