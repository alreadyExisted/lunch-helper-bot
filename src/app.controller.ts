import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  root(): string {
    const date = new Date()
    return `${date} Day: ${date.getDay()}`
  }
}
