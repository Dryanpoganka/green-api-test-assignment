/** Приводит ввод вида «8 (900) 123-45-67» к международному формату 79001234567. */
export function normalizePhone(input: string): number | null {
  let digits = input.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.slice(1)
  if (digits.length === 10 && digits.startsWith('9')) digits = '7' + digits
  if (digits.length < 10 || digits.length > 15) return null
  return Number(digits)
}
