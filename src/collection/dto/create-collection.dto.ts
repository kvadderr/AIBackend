import {
    IsString,
    IsEnum,
    IsNotEmpty,
    MinLength
} from 'class-validator'

export class CreateCollectionDto {

    @IsString()
    @MinLength(4, {message: "Name must have atleast 4 characters"})
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsEnum(['txt2img', 'img2img'])
    type: string;

}
