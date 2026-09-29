export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export interface StateInstanceResponse {
  stateInstance: 'notAuthorized' | 'authorized' | 'blocked' | 'starting' | 'yellowCard'
}

export interface CheckAccountResponse {
  exist: boolean
  chatId?: string
  username?: string
  phoneNumber?: number
}

export interface SendMessageResponse {
  idMessage: string
}

export interface IncomingNotification {
  receiptId: number
  body: NotificationBody
}

export interface NotificationBody {
  typeWebhook: string
  timestamp: number
  idMessage?: string
  senderData?: {
    chatId: string
    chatName?: string
    sender: string
    senderName?: string
  }
  messageData?: {
    typeMessage: string
    textMessageData?: { textMessage: string }
    extendedTextMessageData?: { text: string }
  }
}
