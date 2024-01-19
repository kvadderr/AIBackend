import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GenService } from './gen.service';
import { CreateGenDto } from './dto/create-gen.dto';
import { UpdateGenDto } from './dto/update-gen.dto';

@Controller('gen')
export class GenController {
  constructor(private readonly genService: GenService) {}

  @Post()
  create(@Body() createGenDto: any) {
    return this.genService.create(createGenDto);
  }

  @Post('/createNude')
  createNude(@Body() createGenDto: any) {
    return this.genService.createNude(createGenDto);
  }

  @Post('/faceSwap')
  faceSwap(@Body() createGenDto: any) {
    return this.genService.faceSwap(createGenDto);
  }

  @Post('/colorizePhoto')
  colorizePhoto(@Body() createGenDto: any) {
    return this.genService.restoreimage(createGenDto);
  }

  @Post('/animeModule')
  admimeModule(@Body() createGenDto: any) {
    return this.genService.generateAnime(createGenDto);
  }
  
  @Post('/local')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async local(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return {
      statusCode: 200,
      data: file.originalname,
    };
  }

}
