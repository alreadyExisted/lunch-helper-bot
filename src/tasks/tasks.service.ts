import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { BotService } from 'src/bot/bot.service'

@Injectable()
export class TasksService {
  private logger: Logger

  constructor(private botService: BotService) {
    this.logger = new Logger(TasksService.name)
  }

  @Cron('0 45 11 * * 1-5')
  handleCron() {
    this.botService.sendEverydayNotification()
    this.logger.debug('Sended everyday notification')
  }
}
