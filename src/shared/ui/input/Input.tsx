import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import s from './Input.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search'
}

export function Input({ variant = 'default', className, ...props }: Props) {
  return <input className={cn(s.input, variant === 'search' && s.search, className)} {...props} />
}
