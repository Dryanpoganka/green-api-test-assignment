import { GreenApiError } from '@/shared/api/green-api'

export function errorMessage(error: unknown): string {
  if (error instanceof GreenApiError) {
    if (error.status === 401 || error.status === 403) return 'Неверный idInstance или apiTokenInstance'
    if (error.status === 429) return 'Слишком много запросов, попробуйте позже'
    return `Ошибка GREEN-API (${error.status})`
  }
  if (error instanceof TypeError) return 'Нет соединения с сервером GREEN-API'
  return 'Что-то пошло не так'
}
