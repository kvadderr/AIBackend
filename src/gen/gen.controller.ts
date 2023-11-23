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

  @Get()
  findAll() {
    return this.genService.findAll();
  }

  @Get('/generateMask/:imageName')
  async generateMask(@Param('imageName') imageName: string) {
    console.log(imageName);
    return await this.genService.generateMask(imageName);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenDto: UpdateGenDto) {
    return this.genService.update(+id, updateGenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genService.remove(+id);
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
