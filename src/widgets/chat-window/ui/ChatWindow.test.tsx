import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { ChatsProvider, useChats, type Chat } from '@/entities/chat'
import * as api from '@/shared/api/green-api'
import { ChatWindow } from './ChatWindow'

vi.mock('@/shared/api/green-api', async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  sendMessage: vi.fn(),
}))

const sendMessage = vi.mocked(api.sendMessage)
const creds = { apiUrl: 'https://api.example.com', idInstance: '1', apiTokenInstance: 't' }

const chat: Chat = {
  chatId: '100',
  title: '+79001234567',
  unread: 0,
  messages: [
    { id: 'a', text: 'Привет', direction: 'in', timestamp: 0 },
    { id: 'b', text: 'Не дошло', direction: 'out', timestamp: 0, status: 'error' },
  ],
}

/** Рендерит окно с актуальным состоянием чата из стора */
function ConnectedChatWindow() {
  const chats = useChats((s) => s.chats)
  return <ChatWindow chat={chats[0]} creds={creds} onBack={() => {}} />
}

beforeAll(() => {
  // jsdom не реализует scrollIntoView
  Element.prototype.scrollIntoView = vi.fn()
})

beforeEach(() => {
  // Формат middleware persist из zustand
  localStorage.setItem(`chats:${creds.idInstance}`, JSON.stringify({ state: { chats: [chat] }, version: 0 }))
  sendMessage.mockReset()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('ChatWindow', () => {
  it('неотправленное сообщение можно отправить повторно', async () => {
    sendMessage.mockResolvedValue({ idMessage: 'real-id' })
    render(
      <ChatsProvider idInstance={creds.idInstance}>
        <ConnectedChatWindow />
      </ChatsProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Повторить/ }))

    expect(sendMessage).toHaveBeenCalledWith(creds, '100', 'Не дошло')
    await waitFor(() => expect(screen.queryByRole('button', { name: /Повторить/ })).toBeNull())
    expect(screen.getByLabelText('Отправлено')).toBeTruthy()
  })
})
