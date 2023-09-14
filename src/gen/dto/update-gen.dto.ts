import { PartialType } from '@nestjs/mapped-types';
import { CreateGenDto } from './create-gen.dto';

export class UpdateGenDto extends PartialType(CreateGenDto) {}
