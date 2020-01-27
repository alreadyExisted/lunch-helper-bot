import { Schema } from 'mongoose'

export const UsersSchema = new Schema(
  {
    telegramId: Number,
    telegramChatId: Number,
    firstName: String,
    lastName: String,
    order: Number,
    isActive: Boolean
  },
  {
    timestamps: true
  }
)
