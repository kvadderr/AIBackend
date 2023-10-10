import { Injectable } from '@nestjs/common';
import { CreateGenDto } from './dto/create-gen.dto';
import { UpdateGenDto } from './dto/update-gen.dto';
import { HttpService } from '@nestjs/axios/dist';
import Jimp from 'jimp';
const { exec } = require('child_process');

@Injectable()
export class GenService {

  constructor(private readonly httpService: HttpService) { }

  async create(createGenDto: any) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_img2img;
    console.log(createGenDto);
    const response = await this.httpService.post(requestURL, createGenDto).toPromise();
    const data = response.data;
    return data;
  }

  async executePythonScript(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error executing Python script: ${error.message}`);
          return;
        }

        const base64Image = stdout.trim();
        resolve(base64Image);
      });
    });
  }

  async generateMask(imageName: string ) {

    const pythonScriptPath = 'clothMask/process.py';
    const imagePath = 'public/img/'+imageName;

    const command = `python3 ${pythonScriptPath} --image ${imagePath}`;
    console.log(command);

    try {
      const base64Image = await this.executePythonScript(command).then((base64Image) => {
        return base64Image;
      });
      console.log('Python script output:', base64Image);

      // Now you can use the base64Image as needed in your application
      return base64Image;
    } catch (error) {
      console.error(error);
      // Handle the error as needed
      throw new Error('Failed to generate mask.');
    }

  }

  async generateNSFW() {
  }

  generateUniqueImageName(extension) {
    const timestamp = new Date().getTime(); // Получаем текущую временную метку
    const randomString = Math.random().toString(36).substring(2, 8); // Генерируем случайную строку из символов a-z и 0-9

    return `${timestamp}_${randomString}.${extension}`;
  }

  async findAll() {
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
