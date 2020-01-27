import { Document } from 'mongoose'

export interface User extends Document {
  readonly telegramId: number
  readonly telegramChatId: number
  readonly firstName: string
  readonly lastName: string
  readonly order: number
  readonly isActive: boolean
}
