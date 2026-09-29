import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import s from './Button.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'medium' | 'small' | 'circle'
}

export function Button({ size = 'medium', className, ...props }: Props) {
  return <button className={cn(s.button, size === 'small' && s.small, size === 'circle' && s.circle, className)} {...props} />
}
