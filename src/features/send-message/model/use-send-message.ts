import { useChats, type Message } from '@/entities/chat'
import { sendMessage, type Credentials } from '@/shared/api/green-api'

/** Оптимистичная отправка: сообщение сразу появляется в чате, статус обновляется по ответу сервера. */
export function useSendMessage(creds: Credentials) {
  const dispatch = useChats((s) => s.dispatch)

  async function deliver(chatId: string, localId: string, text: string) {
    try {
      const { idMessage } = await sendMessage(creds, chatId, text)
      dispatch({ type: 'updateMessage', chatId, id: localId, patch: { id: idMessage, status: 'sent' } })
    } catch {
      dispatch({ type: 'updateMessage', chatId, id: localId, patch: { status: 'error' } })
    }
  }

  function send(chatId: string, text: string) {
    const localId = `local-${crypto.randomUUID()}`
    dispatch({
      type: 'addMessage',
      chatId,
      message: { id: localId, text, direction: 'out', timestamp: Date.now(), status: 'sending' },
    })
    return deliver(chatId, localId, text)
  }

  function retry(chatId: string, message: Message) {
    dispatch({ type: 'updateMessage', chatId, id: message.id, patch: { status: 'sending' } })
    return deliver(chatId, message.id, message.text)
  }

  return { send, retry }
}
