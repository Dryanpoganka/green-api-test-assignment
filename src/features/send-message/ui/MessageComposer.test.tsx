import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MessageComposer } from './MessageComposer'

afterEach(cleanup)

function setup() {
  const onSend = vi.fn()
  render(<MessageComposer onSend={onSend} />)
  return { onSend, input: screen.getByPlaceholderText('Сообщение') }
}

describe('MessageComposer', () => {
  it('Enter отправляет обрезанный текст и очищает поле', () => {
    const { onSend, input } = setup()
    fireEvent.change(input, { target: { value: '  текст  ' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSend).toHaveBeenCalledWith('текст')
    expect(input).toHaveProperty('value', '')
  })

  it('Shift+Enter и пустой текст не отправляют', () => {
    const { onSend, input } = setup()
    fireEvent.change(input, { target: { value: 'строка' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSend).not.toHaveBeenCalled()
  })
})
