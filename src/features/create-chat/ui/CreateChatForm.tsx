import { useState, type FormEvent } from 'react'
import type { Credentials } from '@/shared/api/green-api'
import { Button, ErrorText, Input } from '@/shared/ui'
import { useCreateChat } from '../model/use-create-chat'
import s from './CreateChatForm.module.scss'

interface Props {
  creds: Credentials
  onCreated: (chatId: string) => void
}

export function CreateChatForm({ creds, onCreated }: Props) {
  const createChat = useCreateChat(creds)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    const result = await createChat(phone)
    setCreating(false)
    if (result.ok) {
      setError(null)
      setPhone('')
      onCreated(result.chatId)
    } else {
      setError(result.error)
    }
  }

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit}>
        <Input
          variant="search"
          type="tel"
          placeholder="Номер телефона получателя"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoFocus
        />
        <Button size="small" type="submit" disabled={creating}>
          {creating ? '…' : 'Написать'}
        </Button>
      </form>
      {error && <ErrorText className={s.error}>{error}</ErrorText>}
    </>
  )
}
