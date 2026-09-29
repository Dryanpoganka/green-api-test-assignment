import type { ReactNode } from 'react'
import s from './Card.module.scss'

interface Props {
  title: string
  hint?: string
  children: ReactNode
}

/** Карточка по центру экрана на фоне чата: вход, «чат открыт в другой вкладке» */
export function Card({ title, hint, children }: Props) {
  return (
    <div className={s.screen}>
      <div className={s.card}>
        <h1 className={s.title}>{title}</h1>
        {hint && <p className={s.hint}>{hint}</p>}
        {children}
      </div>
    </div>
  )
}
