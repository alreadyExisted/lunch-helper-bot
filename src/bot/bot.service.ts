import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import TelegramBot from 'node-telegram-bot-api'
import { UsersService, User } from 'src/users'

@Injectable()
export class BotService {
  private bot: TelegramBot

  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  initClient() {
    this.registerClient()
    this.registerEvents()
  }

  sendEverydayNotification() {
    this.usersService
      .updateActiveUser()
      .then(user => this.sendActiveUserNotification(user.telegramId, user))
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
    this.registerCommands()
    this.registerChatMembersChanges()
  }

  private registerCommands() {
    this.bot.onText(/\/who/, msg => {
      this.usersService
        .getActiveUser()
        .then(user => this.sendWhoActive(msg.chat.id, user))
    })
    this.bot.onText(/\/all/, msg => {
      this.usersService
        .getAllUsers()
        .then(users => this.sendAll(msg.chat.id, users))
    })
    this.bot.onText(/\/switch/, msg => {
      this.bot.sendMessage(msg.chat.id, 'Соррян эта фича в следующем релизе!')
    })
  }

  private registerGroupChatCreated() {
    this.bot.on('group_chat_created', msg => {
      this.bot.sendMessage(
        msg.chat.id,
        'Приветствую господа! Буду мониторить как вы ходите жрац!'
      )
    })
  }

  private registerChatMembersChanges() {
    this.bot.on('new_chat_members', msg => {
      const {
        new_chat_member: { id, first_name, last_name, is_bot },
        chat
      } = (msg as unknown) as Message
      if (!is_bot) {
        this.usersService.addUser({
          telegramId: id,
          telegramChatId: chat.id,
          firstName: first_name,
          lastName: last_name
        })
        this.bot.sendMessage(msg.chat.id, `Привет ${first_name}!`)
      }
    })
    this.bot.on('left_chat_member', msg => {
      const {
        left_chat_member: { id, first_name }
      } = (msg as unknown) as Message
      this.usersService.removeUser(id)
      this.bot.sendMessage(msg.chat.id, `Пока ${first_name}!`)
    })
  }

  private sendActiveUserNotification(id: number, user: User) {
    this.bot.sendMessage(
      id,
      `Пиздюки пора НА АБЭД! Сегодня начальник обеденного перерыва <b>${user.firstName}</b>!`,
      { parse_mode: 'HTML' }
    )
  }

  private sendWhoActive(id: number, user: User) {
    const text = this.isWeekend()
      ? 'Не бушуй пиздюк! Сегодня выходной! Отдыхай!'
      : `Поздравляю! Сегодня начальник обеденного перерыва <b>${user.firstName}</b>!`
    this.bot.sendMessage(id, text, { parse_mode: 'HTML' })
  }

  private sendAll(id: number, users: User[]) {
    this.bot.sendMessage(
      id,
      `${users
        .map(
          user =>
            `${user.order}. ${user.firstName} *${
              this.isWeekend() || !user.isActive ? '' : 'Начальник'
            }*`
        )
        .join('\n')}`,
      { parse_mode: 'Markdown' }
    )
  }

  private isWeekend() {
    const nowDay = new Date().getDay()
    return nowDay === 0 || nowDay === 6
  }
}

interface Message {
  chat: {
    id: number
  }
  new_chat_member: Member
  left_chat_member: Member
}

interface Member {
  id: number
  is_bot: boolean
  first_name: string
  last_name: string
}
