import type { ReactNode } from 'react'
import { Button, Card } from '@/shared/ui'
import { useSingleTab } from '../model/use-single-tab'

interface Props {
  lockName: string
  children: ReactNode
}

export function SingleTabGuard({ lockName, children }: Props) {
  const { status, takeOver } = useSingleTab(lockName)

  if (status === 'pending') return null

  if (status === 'inactive') {
    return (
      <Card title="Чат открыт в другой вкладке" hint="Одновременно чат может работать только в одной вкладке.">
        <Button onClick={takeOver}>Использовать здесь</Button>
      </Card>
    )
  }

  return children
}
