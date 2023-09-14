import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CollectionModule } from './collection/collection.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ProfileModule } from './profile/profile.module';

import { Collection } from './collection/entities/collection.entity';
import { GenModule } from './gen/gen.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'), // Путь к статическим файлам
      serveRoot: '/static', // URL-префикс для статических файлов
    }),
    ConfigModule.forRoot(),
    ConfigurationModule,
    ProfileModule,
    GenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
