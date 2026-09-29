import { useCallback, useEffect, useState } from 'react'

export type TabStatus = 'pending' | 'active' | 'inactive'

/**
 * Разрешает работать с инстансом только одной вкладке — как WhatsApp Web.
 * Иначе вкладки делят одну очередь уведомлений GREEN-API и «воруют» сообщения друг у друга,
 * а заодно перезаписывают переписку в localStorage.
 *
 * Используется Web Locks API: замок держит активная вкладка, остальные ждут в очереди
 * и автоматически становятся активными, когда её закроют. takeOver() отбирает замок.
 */
export function useSingleTab(lockName: string) {
  // Старый браузер без Web Locks — сразу активны, работаем без защиты
  const [status, setStatus] = useState<TabStatus>(() => (globalThis.navigator?.locks ? 'pending' : 'active'))
  const [takeOverRequest, setTakeOverRequest] = useState(0)

  useEffect(() => {
    const locks = globalThis.navigator?.locks
    if (!locks) return

    const controller = new AbortController()
    let releaseLock!: () => void
    const held = new Promise<void>((resolve) => {
      releaseLock = resolve
    })
    const hold = async () => {
      setStatus('active')
      await held
    }

    async function acquire(steal: boolean): Promise<void> {
      try {
        if (steal) {
          await locks.request(lockName, { steal: true }, hold)
          return
        }
        const acquired = await locks.request(lockName, { ifAvailable: true }, async (lock) => {
          if (!lock) return false
          await hold()
          return true
        })
        if (acquired) return
        setStatus('inactive')
        // Встаём в очередь: получим замок, когда активную вкладку закроют
        await locks.request(lockName, { signal: controller.signal }, hold)
      } catch {
        if (controller.signal.aborted) return
        // Замок отобрала другая вкладка — ждём своей очереди снова
        setStatus('inactive')
        return acquire(false)
      }
    }

    acquire(takeOverRequest > 0)

    return () => {
      controller.abort()
      releaseLock()
    }
  }, [lockName, takeOverRequest])

  const takeOver = useCallback(() => setTakeOverRequest((n) => n + 1), [])

  return { status, takeOver }
}
