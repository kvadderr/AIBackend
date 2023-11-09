import { Injectable } from '@nestjs/common';
import { GenService } from 'src/gen/gen.service';
const TelegramBot = require('node-telegram-bot-api');
const token = '6166756842:AAHmxfFhcV_uL-fx_muJj9LHkyYISMpGsFc';

const bot = new TelegramBot(token, { polling: true });

@Injectable()
export class BotService {
    constructor(
        private readonly genService: GenService,
    ) { }
    botMessage() {
        process.env.NTBA_FIX_350 = '1'
        const fileOpts = {
            filename: 'image',
            contentType: 'image/jpg',
        };

        let original = null;
        let userFace = null;

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

                if (original === null) {
                    original = originalBase64
                } else {
                    userFace = originalBase64
                }

                if (userFace === null) {
                    bot.sendMessage(chatID, "ОТПРАВЬТЕ ЛИЦО ПОЛЬЗОВАТЕЛЯ");
                }

                if (original !== null && userFace !== null) {
                    bot.sendMessage(chatID, "ОЖИДАЙТЕ, ИЗОБРАЖЕНИЕ ГЕНЕРИРУЕТСЯ");
                    console.log('original and userFACE')
                    const imageBase = await this.faseSwap(original, userFace);
                    await bot.sendPhoto(chatID, Buffer.from(imageBase, 'base64'), fileOpts)
                    bot.sendMessage(chatID, "ОТПРАВЬТЕ ОРИГИНАЛ ФОТО И ЛИЦО ПОЛЬЗОВАТЕЛЯ");

                    original = null;
                    userFace = null;
                }

               
            }
            catch (error) {
                console.log(error)
                bot.sendMessage(msg.chat.id, "ПРОИЗОШЛА КАКАЯ-ТА ОШИБКА! ПОМНИТЕ, ОТПРАЙЛЯЙТЕ ТОЛЬКО ИЗОБРАЖЕНИЯ. НАЧИНАЕМ С НУЛЯ");
                original=null;
                userFace =null;
            }

            //let link1 = await bot.getFileLink(data)

        })

        bot.emit()

    }

    async faseSwap(original, userFace) {
        console.log('face SWAAP')
        const data = {
            original: original,
            userFace: userFace
        }
        return this.genService.faceSwap(data);
    }


}