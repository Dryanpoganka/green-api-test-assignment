import { useChats } from '@/entities/chat'
import { checkAccount, type Credentials } from '@/shared/api/green-api'
import { errorMessage, normalizePhone } from '@/shared/lib'

type CreateChatResult = { ok: true; chatId: string } | { ok: false; error: string }

export function useCreateChat(creds: Credentials) {
  const dispatch = useChats((s) => s.dispatch)

  return async function createChat(input: string): Promise<CreateChatResult> {
    const phoneNumber = normalizePhone(input)
    if (!phoneNumber) return { ok: false, error: 'Введите номер в международном формате, например +7 900 123-45-67' }

    try {
      // В Telegram входящие приходят с числовым chatId, а не с номером,
      // поэтому сразу узнаём chatId получателя
      const account = await checkAccount(creds, phoneNumber)
      if (!account.exist || !account.chatId) return { ok: false, error: 'На этом номере нет аккаунта Telegram' }
      const phone = `+${phoneNumber}`
      dispatch({ type: 'addChat', chat: { chatId: account.chatId, title: account.username || phone, phone } })
      return { ok: true, chatId: account.chatId }
    } catch (error) {
      return { ok: false, error: errorMessage(error) }
    }
  }
}
