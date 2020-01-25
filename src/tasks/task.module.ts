import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { BotModule } from 'src/bot/bot.module'

@Module({
  imports: [BotModule],
  providers: [TasksService]
})
export class TasksModule { }
