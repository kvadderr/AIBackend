import { BotService } from "./bot/bot.service";
import { BotColorService } from "./bot/botcolor.service";
import { BotAnimeService } from "./bot/botAnime";
import { Get, Controller, Res, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private botService: BotService, private botColorService: BotColorService, private botAnimeService: BotAnimeService) { }

  @Get("/bot")
  getBotDialog(@Res() res) {
    this.botService.botMessage();
    res.status(HttpStatus.OK).send("Bot service started");
  }

  @Get("/botColor")
  getBotColorDialog(@Res() res) {
    this.botColorService.botMessage();
    res.status(HttpStatus.OK).send("Bot service started");
  }

  @Get("/botAnime")
  getbotAdnimeDialog(@Res() res) {
    this.botAnimeService.botMessage();
    res.status(HttpStatus.OK).send("Bot service started");
  }

}