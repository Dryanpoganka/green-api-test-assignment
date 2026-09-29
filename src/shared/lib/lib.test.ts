import { describe, expect, it } from 'vitest'
import { GreenApiError } from '@/shared/api/green-api'
import { errorMessage } from './error-message'
import { normalizePhone } from './phone'

describe('normalizePhone', () => {
  it.each([
    ['+7 900 123-45-67', 79001234567],
    ['8 (900) 123-45-67', 79001234567],
    ['9001234567', 79001234567],
    ['+380 44 123 4567', 380441234567],
  ])('%s → %d', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it.each(['', '12345', 'abc', '1234567890123456'])('отклоняет «%s»', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

describe('errorMessage', () => {
  it('понятный текст для неверных учётных данных', () => {
    expect(errorMessage(new GreenApiError(401, ''))).toMatch(/Неверный/)
  })

  it('сетевую ошибку отличает от ошибки API', () => {
    expect(errorMessage(new TypeError('Failed to fetch'))).toMatch(/соединения/)
    expect(errorMessage(new GreenApiError(500, ''))).toContain('500')
  })
})
