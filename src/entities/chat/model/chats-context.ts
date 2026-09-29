import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import type { ChatsState, ChatsStore } from './chats-store'

export const ChatsContext = createContext<ChatsStore | null>(null)

/**
 * Читает стор чатов через селектор: компонент перерисуется, только когда изменится выбранная часть.
 * Например, useChats((s) => s.dispatch) не перерисовывается от новых сообщений.
 */
export function useChats<T>(selector: (state: ChatsState) => T): T {
  const store = useContext(ChatsContext)
  if (!store) throw new Error('useChats нужно вызывать внутри ChatsProvider')
  return useStore(store, selector)
}
