import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CollectionModule } from './collection/collection.module';
import { ConfigurationModule } from './configuration/configuration.module';

import { Collection } from './collection/entities/collection.entity';
import { GenModule } from './gen/gen.module';

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
  controllers: [],
  providers: [],
})
export class AppModule {}
