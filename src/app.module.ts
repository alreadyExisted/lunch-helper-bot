import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule } from '@nestjs/config'
import { BotModule } from './bot/bot.module'
import { TasksModule } from './tasks/task.module'
import configModuleOptions from './config'

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    ScheduleModule.forRoot(),
    BotModule,
    TasksModule
  ]
})
export class AppModule { }
