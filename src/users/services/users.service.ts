import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../interfaces'
import { UserDTO } from '../dtos'

@Injectable()
export class UsersService {
  private logger: Logger

  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<User>
  ) {
    this.logger = new Logger(UsersService.name)
  }

  async getAllUsers() {
    const users = await this.userModel.find()
    return users
  }

  async getActiveUser(): Promise<User> {
    const user = await this.userModel.findOne({ isActive: true })
    return user
  }

  async addUser(user: Omit<UserDTO, 'order' | 'isActive'>): Promise<User> {
    const usersCount = await this.userModel.countDocuments()
    await this.userModel.updateMany({}, { isActive: false })
    const dbUser = await this.userModel.findOne({ telegramId: user.telegramId })

    if (!!dbUser) {
      return dbUser
    }

    const creadtedUser = new this.userModel({
      ...user,
      order: usersCount + 1,
      isActive: true
    })
    this.logger.debug(`added user ${creadtedUser.telegramId}`)
    return creadtedUser.save()
  }

  async removeUser(telegramId: number) {
    await this.userModel.deleteOne({ telegramId })
    await this.updateOrders()
    this.logger.debug(`removed user ${telegramId}`)
    return true
  }

  async updateActiveUser(): Promise<User> {
    const prevActiveUser = await this.getActiveUser()

    const usersCount = await this.userModel.countDocuments()

    await this.userModel.updateOne({ isActive: true }, { isActive: false })
    const order =
      usersCount === prevActiveUser.order ? 1 : prevActiveUser.order + 1
    const activeUser = await this.userModel.findOneAndUpdate(
      { order },
      { isActive: true },
      { new: true }
    )

    this.logger.debug(`updated active user ${activeUser?.firstName}`)

    return activeUser
  }

  private async updateOrders() {
    let index = 0
    await this.userModel.find().map(user => {
      index++
      return { ...user, order: index + 1, isActive: index === 1 }
    })
  }
}
