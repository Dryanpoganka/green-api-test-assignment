import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '@/shared/api/green-api'
import { useIncomingMessages } from './use-incoming-messages'

vi.mock('@/shared/api/green-api', async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  receiveNotification: vi.fn(),
  deleteNotification: vi.fn(),
}))

const receive = vi.mocked(api.receiveNotification)
const remove = vi.mocked(api.deleteNotification)

const creds = { apiUrl: 'https://api.example.com', idInstance: '1', apiTokenInstance: 't' }
const body: api.NotificationBody = { typeWebhook: 'incomingMessageReceived', timestamp: 1 }

/** Имитирует long polling: запрос «висит», пока его не отменят. */
function pendingUntilAbort(_c: unknown, _t: number, signal?: AbortSignal) {
  return new Promise<null>((resolve) => signal?.addEventListener('abort', () => resolve(null)))
}

beforeEach(() => {
  vi.resetAllMocks()
  remove.mockResolvedValue({ result: true })
})

describe('useIncomingMessages', () => {
  it('передаёт уведомление обработчику и удаляет его из очереди', async () => {
    receive.mockResolvedValueOnce({ receiptId: 42, body }).mockImplementation(pendingUntilAbort)
    const onNotification = vi.fn()

    const { unmount } = renderHook(() => useIncomingMessages(creds, onNotification, vi.fn()))

    await waitFor(() => expect(remove).toHaveBeenCalledWith(creds, 42))
    expect(onNotification).toHaveBeenCalledWith(body)
    unmount()
  })

  it('удаляет уведомление, даже если обработчик упал', async () => {
    receive.mockResolvedValueOnce({ receiptId: 7, body }).mockImplementation(pendingUntilAbort)
    const onError = vi.fn()

    const { unmount } = renderHook(() =>
      useIncomingMessages(creds, () => {
        throw new Error('boom')
      }, onError),
    )

    await waitFor(() => expect(remove).toHaveBeenCalledWith(creds, 7))
    await waitFor(() => expect(onError).toHaveBeenCalled())
    unmount()
  })

  it('сообщает о сетевой ошибке', async () => {
    receive.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockImplementation(pendingUntilAbort)
    const onError = vi.fn()

    const { unmount } = renderHook(() => useIncomingMessages(creds, vi.fn(), onError))

    await waitFor(() => expect(onError).toHaveBeenCalledWith(expect.any(TypeError)))
    unmount()
  })

  it('останавливает опрос при размонтировании', async () => {
    receive.mockImplementation(pendingUntilAbort)

    const { unmount } = renderHook(() => useIncomingMessages(creds, vi.fn(), vi.fn()))
    await waitFor(() => expect(receive).toHaveBeenCalled())
    const signal = receive.mock.calls[0][2]
    unmount()

    expect(signal?.aborted).toBe(true)
  })
})
