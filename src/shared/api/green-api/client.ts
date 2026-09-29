import type {
  CheckAccountResponse,
  Credentials,
  IncomingNotification,
  NotificationBody,
  SendMessageResponse,
  StateInstanceResponse,
} from './types'

// Документация: https://green-api.com/telegram/docs/api/

export class GreenApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function methodUrl({ apiUrl, idInstance, apiTokenInstance }: Credentials, method: string) {
  return `${apiUrl.replace(/\/+$/, '')}/waInstance${idInstance}/${method}/${apiTokenInstance}`
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new GreenApiError(res.status, text || res.statusText)
  }
  return res.json() as Promise<T>
}

export function getStateInstance(creds: Credentials) {
  return request<StateInstanceResponse>(methodUrl(creds, 'getStateInstance'))
}

export function checkAccount(creds: Credentials, phoneNumber: number) {
  return request<CheckAccountResponse>(methodUrl(creds, 'checkAccount'), {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  })
}

export function sendMessage(creds: Credentials, chatId: string, message: string) {
  return request<SendMessageResponse>(methodUrl(creds, 'sendMessage'), {
    method: 'POST',
    body: JSON.stringify({ chatId, message }),
  })
}

/** Long polling: сервер держит запрос до receiveTimeout секунд и возвращает null, если очередь пуста. */
export function receiveNotification(creds: Credentials, receiveTimeout: number, signal?: AbortSignal) {
  return request<IncomingNotification | null>(
    `${methodUrl(creds, 'receiveNotification')}?receiveTimeout=${receiveTimeout}`,
    { signal },
  )
}

export function deleteNotification(creds: Credentials, receiptId: number) {
  return request<{ result: boolean }>(`${methodUrl(creds, 'deleteNotification')}/${receiptId}`, {
    method: 'DELETE',
  })
}

/** Текст из входящего уведомления или null, если это не текстовое сообщение. */
export function extractText(body: NotificationBody): string | null {
  const data = body.messageData
  if (!data) return null
  if (data.typeMessage === 'textMessage') return data.textMessageData?.textMessage ?? null
  if (data.typeMessage === 'extendedTextMessage') return data.extendedTextMessageData?.text ?? null
  return null
}
