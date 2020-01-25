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
    this.bot = new TelegramBot(this.configService.get('TELEGRAM_TOKEN'), { polling: true })
  }

  private registerEvents() {
    this.registerGroupChatCreated()
    this.registerMessage()
  }

  private registerMessage() {
    this.bot.on('message', msg => {
      this.bot.sendMessage(msg.chat.id, `Привет ${msg.from.first_name}!`)
    })
  }

  private registerGroupChatCreated() {
    this.bot.on('group_chat_created', msg => {
      this.bot.sendMessage(msg.chat.id, 'Приветствую господа! Буду мониторить как вы ходите жрац!')
    })
  }
}
