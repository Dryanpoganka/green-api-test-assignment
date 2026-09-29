import { describe, expect, it } from 'vitest'
import type { Chat, Message } from './types'
import { chatsReducer } from './chats-reducer'

const msg = (id: string, direction: Message['direction'] = 'in'): Message => ({
  id,
  text: id,
  direction,
  timestamp: 0,
})

const chat = (chatId: string, messages: Message[] = []): Chat => ({ chatId, title: chatId, messages, unread: 0 })

describe('chatsReducer', () => {
  it('не создаёт дубликат чата', () => {
    const state = [chat('1')]
    expect(chatsReducer(state, { type: 'addChat', chat: { chatId: '1', title: 'x' } })).toBe(state)
  })

  it('входящее от неизвестного собеседника создаёт чат', () => {
    const next = chatsReducer([], { type: 'addMessage', chatId: '7', message: msg('a'), fallbackTitle: 'Анна', unread: true })
    expect(next).toEqual([{ chatId: '7', title: 'Анна', messages: [msg('a')], unread: 1 }])
  })

  it('игнорирует повторное сообщение с тем же id', () => {
    const state = [chat('1', [msg('a')])]
    expect(chatsReducer(state, { type: 'addMessage', chatId: '1', message: msg('a') })).toBe(state)
  })

  it('поднимает чат с новым сообщением наверх и считает непрочитанные', () => {
    const state = [chat('1'), chat('2')]
    const next = chatsReducer(state, { type: 'addMessage', chatId: '2', message: msg('a'), unread: true })
    expect(next.map((c) => c.chatId)).toEqual(['2', '1'])
    expect(next[0].unread).toBe(1)
  })

  it('обновляет id и статус отправленного сообщения', () => {
    const state = [chat('1', [{ ...msg('tmp', 'out'), status: 'sending' }])]
    const next = chatsReducer(state, {
      type: 'updateMessage',
      chatId: '1',
      id: 'tmp',
      patch: { id: 'real', status: 'sent' },
    })
    expect(next[0].messages[0]).toMatchObject({ id: 'real', status: 'sent' })
  })

  it('markRead сбрасывает счётчик', () => {
    const state = [{ ...chat('1'), unread: 3 }]
    expect(chatsReducer(state, { type: 'markRead', chatId: '1' })[0].unread).toBe(0)
  })
})
