import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { BotModule } from './bot'
import { TasksModule } from './tasks'
import { AppController } from './app.controller'
import configModuleOptions from './config'

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    }),
    ScheduleModule.forRoot(),
    BotModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [ConfigService]
})
export class AppModule {}
