import { useState, type ReactNode } from 'react'
import { ChatsContext } from './chats-context'
import { createChatsStore } from './chats-store'

interface Props {
  idInstance: string
  children: ReactNode
}

/**
 * Даёт дереву стор чатов инстанса. Стор создаётся через контекст, а не глобально,
 * чтобы у каждого инстанса была своя переписка, а в тестах — чистый стор.
 */
export function ChatsProvider({ idInstance, children }: Props) {
  const [store] = useState(() => createChatsStore(idInstance))
  return <ChatsContext value={store}>{children}</ChatsContext>
}
