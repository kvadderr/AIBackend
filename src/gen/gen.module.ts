import { Module } from '@nestjs/common';
import { GenService } from './gen.service';
import { GenController } from './gen.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GenController],
  providers: [GenService],
})
export class GenModule {}
