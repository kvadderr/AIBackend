import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CollectionModule } from './collection/collection.module';
import { ConfigurationModule } from './configuration/configuration.module';

import { Collection } from './collection/entities/collection.entity';
import { GenModule } from './gen/gen.module';
import { BotService } from './bot/bot.service';
import { BotColorService } from './bot/botcolor.service';
import { BotAnimeService } from './bot/botAnime';
import { AppController } from './app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'img'), // Путь к вашему каталогу с изображениями
      serveRoot: '/img', // URL, по которому будут доступны файлы
    }),
    ConfigModule.forRoot(),
    ConfigurationModule,
    GenModule,
  ],
  controllers: [AppController],
  providers: [BotService, BotColorService, BotAnimeService],
})
export class AppModule {}
