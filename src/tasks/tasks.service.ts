import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { BotService } from 'src/bot/bot.service'
import { UsersService } from 'src/users'

@Injectable()
export class TasksService {
  private logger: Logger

  constructor(
    private botService: BotService,
    private usersService: UsersService
  ) {
    this.logger = new Logger(TasksService.name)
  }

  @Cron('57 11 * * 1-5')
  sendEverydayNotification() {
    this.botService.sendEverydayNotification()
    this.logger.debug('Sended everyday notification')
  }

  @Cron('01 00 * * 1-5')
  updateEverydayActiveUser() {
    this.usersService.updateActiveUser()
    this.logger.debug('Updated everyday active user')
  }
}
