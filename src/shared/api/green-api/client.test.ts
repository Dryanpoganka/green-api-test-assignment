import { afterEach, describe, expect, it, vi } from 'vitest'
import { GreenApiError, extractText, sendMessage } from './client'
import type { NotificationBody } from './types'

const creds = { apiUrl: 'https://api.example.com/', idInstance: '1101', apiTokenInstance: 'token' }

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('sendMessage', () => {
  it('собирает URL по шаблону GREEN-API и отправляет JSON', async () => {
    const fetchMock = mockFetch(Response.json({ idMessage: 'abc' }))

    await expect(sendMessage(creds, '100', 'Привет')).resolves.toEqual({ idMessage: 'abc' })

    const [url, init] = fetchMock.mock.calls[0]
    // Лишний слэш в конце apiUrl не должен ломать адрес
    expect(url).toBe('https://api.example.com/waInstance1101/sendMessage/token')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ chatId: '100', message: 'Привет' })
  })

  it('бросает GreenApiError со статусом ответа', async () => {
    mockFetch(new Response('Unauthorized', { status: 401 }))

    await expect(sendMessage(creds, '100', 'x')).rejects.toMatchObject({
      constructor: GreenApiError,
      status: 401,
    })
  })
})

describe('extractText', () => {
  const body = (messageData: NotificationBody['messageData']): NotificationBody => ({
    typeWebhook: 'incomingMessageReceived',
    timestamp: 0,
    messageData,
  })

  it('текстовое сообщение', () => {
    expect(extractText(body({ typeMessage: 'textMessage', textMessageData: { textMessage: 'hi' } }))).toBe('hi')
  })

  it('сообщение со ссылкой', () => {
    expect(extractText(body({ typeMessage: 'extendedTextMessage', extendedTextMessageData: { text: 'link' } }))).toBe(
      'link',
    )
  })

  it('медиа и прочее — null', () => {
    expect(extractText(body({ typeMessage: 'imageMessage' }))).toBeNull()
    expect(extractText(body(undefined))).toBeNull()
  })
})
