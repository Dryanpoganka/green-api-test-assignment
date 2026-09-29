import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import s from './ErrorText.module.scss'

interface Props {
  children: ReactNode
  className?: string
}

export function ErrorText({ children, className }: Props) {
  return <p className={cn(s.error, className)}>{children}</p>
}
