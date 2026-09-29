import { useCallback, useEffect, useRef, useState } from 'react'
import { useChats } from '@/entities/chat'
import { extractText, type Credentials, type NotificationBody } from '@/shared/api/green-api'
import { errorMessage } from '@/shared/lib'
import { useIncomingMessages } from './use-incoming-messages'

/** Кладёт входящие текстовые сообщения в чаты. Возвращает текст ошибки соединения, если она есть. */
export function useReceiveMessages(creds: Credentials, activeChatId: string | null) {
  const dispatch = useChats((s) => s.dispatch)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Нужен внутри обработчика уведомлений, который не пересоздаётся при смене чата
  const activeChatIdRef = useRef(activeChatId)
  useEffect(() => {
    activeChatIdRef.current = activeChatId
  }, [activeChatId])

  const handleNotification = useCallback(
    (body: NotificationBody) => {
      setConnectionError(null)
      // Остальные типы уведомлений (статусы, исходящие с телефона и т.д.) просто пропускаем
      if (body.typeWebhook !== 'incomingMessageReceived' || !body.senderData) return
      const text = extractText(body)
      if (text === null) return
      dispatch({
        type: 'addMessage',
        chatId: body.senderData.chatId,
        fallbackTitle: body.senderData.senderName || body.senderData.chatName,
        unread: body.senderData.chatId !== activeChatIdRef.current,
        message: {
          id: body.idMessage ?? `in-${body.timestamp}`,
          text,
          direction: 'in',
          timestamp: body.timestamp * 1000,
        },
      })
    },
    [dispatch],
  )

  const handleError = useCallback((error: unknown) => setConnectionError(errorMessage(error)), [])

  useIncomingMessages(creds, handleNotification, handleError)

  return { connectionError }
}
