import { Module } from '@nestjs/common'
import { BotModule } from 'src/bot'
import { UsersModule } from 'src/users'
import { TasksService } from './tasks.service'

@Module({
  imports: [BotModule, UsersModule],
  providers: [TasksService]
})
export class TasksModule { }
