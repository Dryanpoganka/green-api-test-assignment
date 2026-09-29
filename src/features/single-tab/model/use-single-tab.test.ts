import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSingleTab } from './use-single-tab'

type Callback = (lock: object | null) => Promise<unknown>

/** Упрощённый LockManager на один замок: очередь, ifAvailable, steal и отмена через signal. */
class FakeLocks {
  private holder: { reject: (e: unknown) => void } | null = null
  private queue: Array<() => void> = []

  request(_name: string, options: LockOptions, callback: Callback): Promise<unknown> {
    if (options.steal && this.holder) {
      this.holder.reject(new DOMException('Lock stolen', 'AbortError'))
      this.holder = null
    }
    if (options.ifAvailable && this.holder) return callback(null)
    if (!this.holder) return this.grant(callback)

    return new Promise((resolve, reject) => {
      const start = () => this.grant(callback).then(resolve, reject)
      this.queue.push(start)
      options.signal?.addEventListener('abort', () => {
        this.queue = this.queue.filter((fn) => fn !== start)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
  }

  private grant(callback: Callback): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const holder = { reject }
      this.holder = holder
      callback({}).then((result) => {
        if (this.holder !== holder) return
        this.holder = null
        this.queue.shift()?.()
        resolve(result)
      }, reject)
    })
  }
}

beforeEach(() => {
  vi.stubGlobal('navigator', { locks: new FakeLocks() })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useSingleTab', () => {
  it('первая вкладка активна, вторая — нет', async () => {
    const first = renderHook(() => useSingleTab('chat'))
    await waitFor(() => expect(first.result.current.status).toBe('active'))

    const second = renderHook(() => useSingleTab('chat'))
    await waitFor(() => expect(second.result.current.status).toBe('inactive'))
  })

  it('takeOver отбирает замок у другой вкладки', async () => {
    const first = renderHook(() => useSingleTab('chat'))
    await waitFor(() => expect(first.result.current.status).toBe('active'))
    const second = renderHook(() => useSingleTab('chat'))
    await waitFor(() => expect(second.result.current.status).toBe('inactive'))

    act(() => second.result.current.takeOver())

    await waitFor(() => expect(second.result.current.status).toBe('active'))
    await waitFor(() => expect(first.result.current.status).toBe('inactive'))
  })

  it('после закрытия активной вкладки следующая становится активной сама', async () => {
    const first = renderHook(() => useSingleTab('chat'))
    await waitFor(() => expect(first.result.current.status).toBe('active'))
    const second = renderHook(() => useSingleTab('chat'))
    await waitFor(() => expect(second.result.current.status).toBe('inactive'))

    first.unmount()

    await waitFor(() => expect(second.result.current.status).toBe('active'))
  })

  it('без Web Locks работает как обычно', async () => {
    vi.stubGlobal('navigator', {})
    const { result } = renderHook(() => useSingleTab('chat'))
    await waitFor(() => expect(result.current.status).toBe('active'))
  })
})
