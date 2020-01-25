import { Injectable } from '@nestjs/common'
import TelegramBot from 'node-telegram-bot-api'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BotService {
  private bot: TelegramBot

  constructor(private configService: ConfigService) { }

  initClient() {
    this.registerClient()
    this.registerEvents()
  }

  sendEverydayNotification() {
    this.bot.sendMessage(-275942893, 'Notify')
  }

  private registerClient() {
    this.bot = new TelegramBot(this.configService.get('TELEGRAM_TOKEN'), {
      polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10
        }
      }
    })
  }

  private registerEvents() {
    this.registerGroupChatCreated()
    this.registerMessage()
    this.registerChatMembersChanges()
  }

  private registerMessage() {
    this.bot.on('message', msg => {
      this.bot.sendMessage(msg.chat.id, `Спасибо ${msg.from.first_name} что написал ${msg.text}!`)
    })
  }

  private registerGroupChatCreated() {
    this.bot.on('group_chat_created', msg => {
      this.bot.sendMessage(msg.chat.id, 'Приветствую господа! Буду мониторить как вы ходите жрац!')
    })
  }

  private registerChatMembersChanges() {
    this.bot.on('new_chat_members', msg => {
      const { new_chat_member: { first_name } } = (msg as unknown as Message)
      this.bot.sendMessage(msg.chat.id, `Привет ${first_name}!`)
    })
    this.bot.on('left_chat_member', msg => {
      const { left_chat_member: { first_name } } = (msg as unknown as Message)
      this.bot.sendMessage(msg.chat.id, `Пока ${first_name}!`)
    })
  }
}

interface Message {
  new_chat_member: Member
  left_chat_member: Member
}

interface Member {
  id: number
  is_bot: boolean
  first_name: string
  last_name: string
}
