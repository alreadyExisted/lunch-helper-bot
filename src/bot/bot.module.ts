import { Module, OnModuleInit } from '@nestjs/common'
import { BotService } from './bot.service'
import { ConfigService } from '@nestjs/config'

@Module({
  providers: [BotService, ConfigService],
  exports: [BotService]
})
export class BotModule implements OnModuleInit {
  constructor(private botService: BotService) { }

  onModuleInit() {
    this.botService.initClient()
  }
}
