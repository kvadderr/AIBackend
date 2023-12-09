import { Injectable } from '@nestjs/common';
import { GenService } from 'src/gen/gen.service';
const TelegramBot = require('node-telegram-bot-api');
const token = '6652585891:AAG7Tl35EIDb2ifIKuEkp8F4YPx4_-oSIGY';

const bot = new TelegramBot(token, { polling: true });

@Injectable()
export class BotColorService {
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
                const photos = msg;
                const data = msg.photo[msg.photo?.length - 1]?.file_id;
                let link = await bot.getFileLink(data)

                const image = await fetch(link);
                const imageBlob = await image.blob();
                const blobBuffer = await imageBlob.arrayBuffer();
                const originalBase64 = Buffer.from(blobBuffer).toString('base64');


                bot.sendMessage(chatID, "ОЖИДАЙТЕ, ИЗОБРАЖЕНИЕ ГЕНЕРИРУЕТСЯ");
                console.log('original and userFACE')
                const imageBase = await this.colorizePhoto(originalBase64);
                await bot.sendPhoto(chatID, Buffer.from(imageBase, 'base64'), fileOpts)
                bot.sendMessage(chatID, "ОТПРАВЬТЕ СТАРОЕ ФОТО");




            }
            catch (error) {
                console.log(error)
                bot.sendMessage(msg.chat.id, "ПРОИЗОШЛА КАКАЯ-ТА ОШИБКА! ПОМНИТЕ, ОТПРАЙЛЯЙТЕ ТОЛЬКО ИЗОБРАЖЕНИЯ. НАЧИНАЕМ С НУЛЯ");
            }

            //let link1 = await bot.getFileLink(data)

        })

        bot.emit()

    }

    async colorizePhoto(original) {
        console.log('face SWAAP')
        const data = {
            image: original
        }
        return this.genService.colorizePhoto(data);
    }


}