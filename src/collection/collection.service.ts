import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionService {

  constructor(
    
  ) {}

  create() {

    
    return 
  }

  findAll(){
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
