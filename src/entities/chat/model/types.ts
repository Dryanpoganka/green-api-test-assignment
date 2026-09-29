export type MessageStatus = 'sending' | 'sent' | 'error'

export interface Message {
  id: string
  text: string
  direction: 'in' | 'out'
  timestamp: number
  status?: MessageStatus
}

export interface Chat {
  chatId: string
  title: string
  phone?: string
  messages: Message[]
  unread: number
}
