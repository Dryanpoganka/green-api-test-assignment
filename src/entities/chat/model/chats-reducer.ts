import type { Chat, Message, MessageStatus } from './types'
export type ChatsAction =
  | { type: 'addChat'; chat: Omit<Chat, 'messages' | 'unread'> }
  | { type: 'addMessage'; chatId: string; message: Message; fallbackTitle?: string; unread?: boolean }
  | { type: 'updateMessage'; chatId: string; id: string; patch: { id?: string; status: MessageStatus } }
  | { type: 'markRead'; chatId: string }

export function chatsReducer(chats: Chat[], action: ChatsAction): Chat[] {
  switch (action.type) {
    case 'addChat':
      if (chats.some((c) => c.chatId === action.chat.chatId)) return chats
      return [{ ...action.chat, messages: [], unread: 0 }, ...chats]

    case 'addMessage': {
      const addUnread = action.unread ? 1 : 0
      const existing = chats.find((c) => c.chatId === action.chatId)
      if (!existing) {
        // Написал кто-то, с кем чат ещё не создан — создаём его автоматически
        const chat: Chat = {
          chatId: action.chatId,
          title: action.fallbackTitle || action.chatId,
          messages: [action.message],
          unread: addUnread,
        }
        return [chat, ...chats]
      }
      if (existing.messages.some((m) => m.id === action.message.id)) return chats
      const updated = {
        ...existing,
        messages: [...existing.messages, action.message],
        unread: existing.unread + addUnread,
      }
      // Чат с новым сообщением поднимаем наверх списка
      return [updated, ...chats.filter((c) => c !== existing)]
    }

    case 'updateMessage':
      return chats.map((c) =>
        c.chatId !== action.chatId
          ? c
          : {
              ...c,
              messages: c.messages.map((m) => (m.id === action.id ? { ...m, ...action.patch } : m)),
            },
      )

    case 'markRead':
      return chats.map((c) => (c.chatId === action.chatId && c.unread ? { ...c, unread: 0 } : c))
  }
}

