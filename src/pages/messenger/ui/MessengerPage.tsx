import { useState } from 'react'
import { ChatsProvider, useChats } from '@/entities/chat'
import { useReceiveMessages } from '@/features/receive-messages'
import type { Credentials } from '@/shared/api/green-api'
import { cn } from '@/shared/lib'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'
import s from './MessengerPage.module.scss'

interface Props {
  creds: Credentials
  onLogout: () => void
}

export function MessengerPage({ creds, onLogout }: Props) {
  return (
    <ChatsProvider key={creds.idInstance} idInstance={creds.idInstance}>
      <Messenger creds={creds} onLogout={onLogout} />
    </ChatsProvider>
  )
}

function Messenger({ creds, onLogout }: Props) {
  const dispatch = useChats((s) => s.dispatch)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const activeChat = useChats((s) => s.chats.find((c) => c.chatId === activeChatId))
  const { connectionError } = useReceiveMessages(creds, activeChatId)

  function openChat(chatId: string) {
    setActiveChatId(chatId)
    dispatch({ type: 'markRead', chatId })
  }

  return (
    <div className={cn(s.messenger, activeChat && s.chatOpen)}>
      <div className={s.aside}>
        <ChatSidebar creds={creds} activeChatId={activeChatId} onSelect={openChat} onLogout={onLogout} />
      </div>
      <main className={s.main}>
        {connectionError && <div className={s.banner}>{connectionError}. Переподключаемся…</div>}
        {activeChat ? (
          <ChatWindow key={activeChat.chatId} chat={activeChat} creds={creds} onBack={() => setActiveChatId(null)} />
        ) : (
          <div className={s.placeholder}>Выберите чат или создайте новый по номеру телефона</div>
        )}
      </main>
    </div>
  )
}
