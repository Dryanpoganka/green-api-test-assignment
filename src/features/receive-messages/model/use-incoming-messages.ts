import { useEffect, useRef } from 'react'
import { deleteNotification, receiveNotification, type Credentials, type NotificationBody } from '@/shared/api/green-api'

const RECEIVE_TIMEOUT_SEC = 20
const RETRY_DELAY_MS = 3000

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

/**
 * Забирает уведомления из очереди GREEN-API (HTTP API, long polling)
 * и удаляет каждое после обработки, чтобы получить следующее.
 */
export function useIncomingMessages(
  creds: Credentials,
  onNotification: (body: NotificationBody) => void,
  onError: (error: unknown) => void,
) {
  // Колбэки держим в ref, чтобы цикл опроса не перезапускался при каждом рендере
  const handlers = useRef({ onNotification, onError })
  useEffect(() => {
    handlers.current = { onNotification, onError }
  })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function poll() {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(creds, RECEIVE_TIMEOUT_SEC, signal)
          if (!notification) continue
          try {
            handlers.current.onNotification(notification.body)
          } finally {
            await deleteNotification(creds, notification.receiptId)
          }
        } catch (error) {
          if (signal.aborted) return
          handlers.current.onError(error)
          await sleep(RETRY_DELAY_MS, signal)
        }
      }
    }

    poll()
    return () => controller.abort()
  }, [creds])
}
