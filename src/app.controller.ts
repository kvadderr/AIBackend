import { BotService } from "./bot/bot.service";
import { Get, Controller, Res, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private botService:BotService) {}

  @Get("/bot")
  getBotDialog(@Res() res) {
    this.botService.botMessage();
    res.status(HttpStatus.OK).send("Bot service started");
  }
}