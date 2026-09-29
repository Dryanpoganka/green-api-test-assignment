import { useEffect, useRef } from 'react'
import { Avatar, MessageBubble, type Chat } from '@/entities/chat'
import { MessageComposer, RetryButton, useSendMessage } from '@/features/send-message'
import type { Credentials } from '@/shared/api/green-api'
import s from './ChatWindow.module.scss'

interface Props {
  chat: Chat
  creds: Credentials
  onBack: () => void
}

export function ChatWindow({ chat, creds, onBack }: Props) {
  const { send, retry } = useSendMessage(creds)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [chat.chatId, chat.messages.length])

  return (
    <section className={s.chat}>
      <header className={s.header}>
        <button className={s.back} onClick={onBack} aria-label="Назад к списку чатов">
          ←
        </button>
        <Avatar id={chat.chatId} title={chat.title} size="small" />
        <div>
          <div className={s.title}>{chat.title}</div>
          {chat.phone && chat.phone !== chat.title && <div className={s.subtitle}>{chat.phone}</div>}
        </div>
      </header>

      {/* role="log" — скринридер зачитывает новые сообщения по мере появления */}
      <div className={s.messages} role="log" aria-label={`Переписка с ${chat.title}`}>
        {chat.messages.length === 0 && <p className={s.empty}>Напишите первое сообщение</p>}
        {chat.messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            action={
              m.direction === 'out' && m.status === 'error' ? (
                <RetryButton onRetry={() => retry(chat.chatId, m)} />
              ) : undefined
            }
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageComposer onSend={(text) => send(chat.chatId, text)} />
    </section>
  )
}
