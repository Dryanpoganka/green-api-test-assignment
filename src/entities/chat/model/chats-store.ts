import { persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import { chatsReducer, type ChatsAction } from './chats-reducer'
import type { Chat } from './types'

export interface ChatsState {
  chats: Chat[]
  dispatch: (action: ChatsAction) => void
}

/**
 * Стор чатов одного инстанса. Логика изменений — в чистом chatsReducer,
 * persist сохраняет чаты в localStorage и синхронно восстанавливает их при создании стора.
 */
export function createChatsStore(idInstance: string) {
  return createStore<ChatsState>()(
    persist(
      (set) => ({
        chats: [],
        dispatch: (action) => set((state) => ({ chats: chatsReducer(state.chats, action) })),
      }),
      {
        name: `chats:${idInstance}`,
        // dispatch — функция, её не сохраняем
        partialize: (state) => ({ chats: state.chats }),
      },
    ),
  )
}

export type ChatsStore = ReturnType<typeof createChatsStore>
