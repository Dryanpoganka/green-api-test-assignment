import type { ReactNode } from 'react'
import s from './Field.module.scss'

interface Props {
  label: string
  children: ReactNode
}

/** Подпись над полем ввода. Обёртка — label, поэтому клик по подписи фокусирует поле */
export function Field({ label, children }: Props) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      {children}
    </label>
  )
}
