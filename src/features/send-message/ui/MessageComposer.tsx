import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '@/shared/ui'
import s from './MessageComposer.module.scss'

interface Props {
  onSend: (text: string) => void
}

export function MessageComposer({ onSend }: Props) {
  const [text, setText] = useState('')

  function submit() {
    const value = text.trim()
    if (!value) return
    onSend(value)
    setText('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter — отправить, Shift+Enter — перенос строки
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form className={s.composer} onSubmit={handleSubmit}>
      <textarea
        className={s.input}
        placeholder="Сообщение"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={4096}
        autoFocus
      />
      <Button size="circle" type="submit" disabled={!text.trim()} aria-label="Отправить">
        ➤
      </Button>
    </form>
  )
}
