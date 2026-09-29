import { useState } from 'react'
import { MessengerPage } from '@/pages/messenger'
import { LoginForm, clearCredentials, loadCredentials, saveCredentials } from '@/features/auth'
import { SingleTabGuard } from '@/features/single-tab'
import type { Credentials } from '@/shared/api/green-api'

export function App() {
  const [creds, setCreds] = useState<Credentials | null>(loadCredentials)

  function handleLogin(value: Credentials) {
    saveCredentials(value)
    setCreds(value)
  }

  function handleLogout() {
    clearCredentials()
    setCreds(null)
  }

  if (!creds) return <LoginForm onLogin={handleLogin} />

  // Страница монтируется только в активной вкладке: при активации заново читает переписку из localStorage
  return (
    <SingleTabGuard lockName={`green-api:${creds.idInstance}`}>
      <MessengerPage creds={creds} onLogout={handleLogout} />
    </SingleTabGuard>
  )
}
