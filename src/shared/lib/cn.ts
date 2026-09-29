/** Склеивает CSS-классы, пропуская пустые: cn(s.item, active && s.active) */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
