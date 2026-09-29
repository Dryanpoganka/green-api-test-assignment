import { cn } from '@/shared/lib'
import s from './Avatar.module.scss'

// Градиенты в духе аватаров MAX; цвет стабилен для одного и того же чата
const GRADIENTS = [
  ['#b18cff', '#6f6bff'],
  ['#ff8fb1', '#ff4f7b'],
  ['#ffc46b', '#ff8a3d'],
  ['#5fe3a1', '#1cb56b'],
  ['#6fd3ff', '#2f8dff'],
  ['#ff9f7a', '#ff5f4f'],
]

function hash(value: string) {
  let h = 0
  for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) | 0
  return Math.abs(h)
}

function initials(title: string) {
  const clean = title.replace(/^[+@]/, '')
  if (/^\d/.test(clean)) return clean[0]
  const words = clean.split(/\s+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

interface Props {
  id: string
  title: string
  size?: 'medium' | 'small'
}

export function Avatar({ id, title, size = 'medium' }: Props) {
  const [from, to] = GRADIENTS[hash(id) % GRADIENTS.length]
  return (
    <span
      className={cn(s.avatar, size === 'small' && s.small)}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials(title) || '?'}
    </span>
  )
}
