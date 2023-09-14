import { Injectable } from '@nestjs/common';
import { CreateGenDto } from './dto/create-gen.dto';
import { UpdateGenDto } from './dto/update-gen.dto';
import { HttpService } from '@nestjs/axios/dist';
import Jimp from 'jimp';

@Injectable()
export class GenService {

  constructor(private readonly httpService: HttpService) { }

  async create(createGenDto: CreateGenDto) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_txt2img;
    console.log(requestURL);
    const response = await this.httpService.post(requestURL, createGenDto).toPromise();
    const data = response.data?.images[0];
    const buffer = Buffer.from(data, "base64");
    const imageName = this.generateUniqueImageName("jpg"); 
    Jimp.read(buffer, (err, res) => {
      if (err) throw new Error(err.message);
      res.write("images/"+imageName)
    })     

    return imageName;
  }

  generateUniqueImageName(extension) {
    const timestamp = new Date().getTime(); // Получаем текущую временную метку
    const randomString = Math.random().toString(36).substring(2, 8); // Генерируем случайную строку из символов a-z и 0-9
  
    return `${timestamp}_${randomString}.${extension}`;
  }

  findAll() {
    return `This action returns all gen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gen`;
  }

  update(id: number, updateGenDto: UpdateGenDto) {
    return `This action updates a #${id} gen`;
  }

  remove(id: number) {
    return `This action removes a #${id} gen`;
  }
}
