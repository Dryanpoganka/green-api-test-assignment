import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import s from './IconButton.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark'
}

/** Круглая кнопка с иконкой. Подпись для скринридера — через aria-label */
export function IconButton({ variant = 'light', className, ...props }: Props) {
  return <button className={cn(s.button, variant === 'dark' && s.dark, className)} {...props} />
}
