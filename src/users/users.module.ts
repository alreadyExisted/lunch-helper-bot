import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersSchema } from './schemas'
import { UsersService } from './services'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }])
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
