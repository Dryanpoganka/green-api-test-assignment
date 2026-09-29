import { afterEach, describe, expect, it } from 'vitest'
import { createChatsStore } from './chats-store'

afterEach(() => localStorage.clear())

describe('createChatsStore', () => {
  it('сохраняет чаты и восстанавливает их в новом сторе того же инстанса', () => {
    const store = createChatsStore('1')
    store.getState().dispatch({ type: 'addChat', chat: { chatId: '100', title: 'Аня' } })

    const restored = createChatsStore('1')
    expect(restored.getState().chats.map((c) => c.chatId)).toEqual(['100'])
  })

  it('у разных инстансов своя переписка', () => {
    createChatsStore('1').getState().dispatch({ type: 'addChat', chat: { chatId: '100', title: 'Аня' } })

    expect(createChatsStore('2').getState().chats).toEqual([])
  })
})
