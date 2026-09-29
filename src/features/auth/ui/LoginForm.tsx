import { useState, type FormEvent } from 'react'
import { getStateInstance, type Credentials } from '@/shared/api/green-api'
import { errorMessage } from '@/shared/lib'
import { Button, Card, ErrorText, Field, Input } from '@/shared/ui'
import s from './LoginForm.module.scss'

const DEFAULT_API_URL = 'https://api.green-api.com'

interface Props {
  onLogin: (creds: Credentials) => void
}

export function LoginForm({ onLogin }: Props) {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL)
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const creds = {
      apiUrl: apiUrl.trim(),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    }
    setError(null)
    setLoading(true)
    try {
      const { stateInstance } = await getStateInstance(creds)
      if (stateInstance !== 'authorized') {
        setError(`Инстанс не авторизован (состояние: ${stateInstance}). Привяжите аккаунт Telegram в личном кабинете GREEN-API.`)
        return
      }
      onLogin(creds)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Вход" hint="Данные инстанса из личного кабинета GREEN-API">
      {/* autoComplete отключён, чтобы менеджер паролей не подставлял логин/пароль от сайтов */}
      <form className={s.form} onSubmit={handleSubmit} autoComplete="off">
        <Field label="idInstance">
          <Input
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            name="idInstance"
            inputMode="numeric"
            autoComplete="off"
            required
            autoFocus
          />
        </Field>

        <Field label="apiTokenInstance">
          <Input
            type="password"
            name="apiTokenInstance"
            autoComplete="new-password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
          />
        </Field>

        <Field label="apiUrl">
          <Input name="apiUrl" inputMode="url" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} required />
        </Field>

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Проверяем…' : 'Войти'}
        </Button>
      </form>
    </Card>
  )
}
