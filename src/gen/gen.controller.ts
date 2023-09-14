import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenService } from './gen.service';
import { CreateGenDto } from './dto/create-gen.dto';
import { UpdateGenDto } from './dto/update-gen.dto';

@Controller('gen')
export class GenController {
  constructor(private readonly genService: GenService) {}

  @Post()
  create(@Body() createGenDto: CreateGenDto) {
    return this.genService.create(createGenDto);
  }

  @Get()
  findAll() {
    return this.genService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenDto: UpdateGenDto) {
    return this.genService.update(+id, updateGenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genService.remove(+id);
  }
}
