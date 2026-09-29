import { cn, formatTime } from '@/shared/lib'
import type { Chat } from '../model/types'
import { Avatar } from './Avatar'
import s from './ChatListItem.module.scss'

interface Props {
  chat: Chat
  active: boolean
  onClick: () => void
}

export function ChatListItem({ chat, active, onClick }: Props) {
  const last = chat.messages.at(-1)
  return (
    <button className={cn(s.item, active && s.active)} onClick={onClick}>
      <Avatar id={chat.chatId} title={chat.title} />
      <span className={s.body}>
        <span className={s.row}>
          <span className={s.title}>{chat.title}</span>
          {last && <span className={s.time}>{formatTime(last.timestamp)}</span>}
        </span>
        <span className={s.row}>
          <span className={s.preview}>
            {last ? `${last.direction === 'out' ? 'Вы: ' : ''}${last.text}` : 'Нет сообщений'}
          </span>
          {chat.unread > 0 && <span className={s.badge}>{chat.unread}</span>}
        </span>
      </span>
    </button>
  )
}
