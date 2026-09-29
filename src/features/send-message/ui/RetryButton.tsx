import s from './RetryButton.module.scss'

interface Props {
  onRetry: () => void
}

export function RetryButton({ onRetry }: Props) {
  return (
    <button className={s.retry} onClick={onRetry} title="Отправить ещё раз">
      ⚠ Не отправлено · Повторить
    </button>
  )
}
