import { useState } from 'react'
import { ChatListItem, useChats } from '@/entities/chat'
import { CreateChatForm } from '@/features/create-chat'
import type { Credentials } from '@/shared/api/green-api'
import { IconButton } from '@/shared/ui'
import s from './ChatSidebar.module.scss'

interface Props {
  creds: Credentials
  activeChatId: string | null
  onSelect: (chatId: string) => void
  onLogout: () => void
}

export function ChatSidebar({ creds, activeChatId, onSelect, onLogout }: Props) {
  const chats = useChats((s) => s.chats)
  const [formOpen, setFormOpen] = useState(chats.length === 0)

  function handleCreated(chatId: string) {
    setFormOpen(false)
    onSelect(chatId)
  }

  return (
    <aside className={s.sidebar}>
      <header className={s.header}>
        <h1 className={s.title}>Чаты</h1>
        <IconButton onClick={onLogout} title="Выйти" aria-label="Выйти">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </IconButton>
        <IconButton
          variant="dark"
          onClick={() => setFormOpen((open) => !open)}
          title="Новый чат"
          aria-label="Новый чат"
          aria-expanded={formOpen}
        >
          {formOpen ? '×' : '+'}
        </IconButton>
      </header>

      {formOpen && <CreateChatForm creds={creds} onCreated={handleCreated} />}

      <ul className={s.list}>
        {chats.length === 0 && <li className={s.empty}>Введите номер, чтобы начать переписку</li>}
        {chats.map((chat) => (
          <li key={chat.chatId}>
            <ChatListItem chat={chat} active={chat.chatId === activeChatId} onClick={() => onSelect(chat.chatId)} />
          </li>
        ))}
      </ul>
    </aside>
  )
}
