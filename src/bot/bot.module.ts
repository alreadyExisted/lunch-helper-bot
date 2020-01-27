import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BotService } from './bot.service'
import { UsersModule, UsersService } from 'src/users'

@Module({
  imports: [UsersModule],
  providers: [BotService, ConfigService],
  exports: [BotService]
})
export class BotModule implements OnModuleInit {
  constructor(private botService: BotService) { }

  onModuleInit() {
    this.botService.initClient()
  }
}
