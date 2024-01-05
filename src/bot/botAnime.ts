import { Injectable } from '@nestjs/common';
import { GenService } from 'src/gen/gen.service';
const sizeOf = require("image-size")

const TelegramBot = require('node-telegram-bot-api');
const token = '6952873362:AAFp4UlIXiY2ZCBinqMvm7S2PfIdv0GIgwM';

const bot = new TelegramBot(token, { polling: true });

@Injectable()
export class BotAnimeService {
    constructor(
        private readonly genService: GenService,
    ) { }
    botMessage() {
        process.env.NTBA_FIX_350 = '1'
        const fileOpts = {
            filename: 'image',
            contentType: 'image/jpg',
        };


        bot.on('message', async (msg) => {

            try {
                const chatID = msg.chat.id;
                const data = msg.photo[msg.photo?.length - 1]?.file_id;
                const caption = msg.caption || '';
                let link = await bot.getFileLink(data)
                let isReal;
                if (caption.includes('isReal')) {
                    isReal = true
                  } else {
                    isReal = false
                  }
                const image = await fetch(link);
                const imageBlob = await image.blob();
                const blobBuffer = await imageBlob.arrayBuffer();
                const originalBase64 = Buffer.from(blobBuffer).toString('base64');


                bot.sendMessage(chatID, "ОЖИДАЙТЕ, ИЗОБРАЖЕНИЕ ГЕНЕРИРУЕТСЯ");
                const imageBase = await this.colorizePhoto(originalBase64, caption, isReal);
                await bot.sendPhoto(chatID, Buffer.from(imageBase, 'base64'), fileOpts)
                bot.sendMessage(chatID, "ОТПРАВЬТЕ ФОТО");

            }
            catch (error) {
                bot.sendMessage(msg.chat.id, "ПРОИЗОШЛА КАКАЯ-ТА ОШИБКА! ПОМНИТЕ, ОТПРАЙЛЯЙТЕ ТОЛЬКО ИЗОБРАЖЕНИЯ. НАЧИНАЕМ С НУЛЯ");
            }

            //let link1 = await bot.getFileLink(data)

        })

        bot.emit()

    }

    async colorizePhoto(original, prompt, isReal) {
        const data = {
            prompt: prompt,
            image: original,
            isReal: isReal
        }
        console.log(data)
        return await this.genService.generateAnime(data);
    }


}