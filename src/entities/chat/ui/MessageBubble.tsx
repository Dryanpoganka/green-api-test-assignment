import type { ReactNode } from 'react'
import { cn, formatTime } from '@/shared/lib'
import type { Message } from '../model/types'
import s from './MessageBubble.module.scss'

const STATUS_ICON = { sending: '🕓', sent: '✓' } as const
const STATUS_LABEL = { sending: 'Отправляется', sent: 'Отправлено' } as const

interface Props {
  message: Message
  /** Слот для действий над сообщением — например, повторной отправки из фичи */
  action?: ReactNode
}

export function MessageBubble({ message: m, action }: Props) {
  return (
    <div className={cn(s.message, m.direction === 'in' ? s.in : s.out)}>
      <span className={s.text}>{m.text}</span>
      <span className={s.meta}>
        {formatTime(m.timestamp)}
        {m.direction === 'out' && (m.status === 'sending' || m.status === 'sent') && (
          <span aria-label={STATUS_LABEL[m.status]} title={STATUS_LABEL[m.status]}>
            {STATUS_ICON[m.status]}
          </span>
        )}
        {action}
      </span>
    </div>
  )
}
