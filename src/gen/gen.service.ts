import { Injectable } from '@nestjs/common';
import { CreateGenDto } from './dto/create-gen.dto';
import { UpdateGenDto } from './dto/update-gen.dto';
import { HttpService } from '@nestjs/axios/dist';
import Jimp from 'jimp';
import fs from 'fs';

const { exec } = require('child_process');

@Injectable()
export class GenService {

  constructor(private readonly httpService: HttpService) { }

  async imageUrlToBase64(url) {
    try {
      const response = await fetch(url);

      const blob = await response.arrayBuffer();

      const contentType = response.headers.get('content-type');

      const base64String = `data:${contentType};base64,${Buffer.from(
        blob,
      ).toString('base64')}`;

      return base64String;
    } catch (err) {
      console.log(err);
    }
  }

  async create(createGenDto: any) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_img2img;

    const mask = await this.generateMask(createGenDto.imageName)
    const base64String = await this.imageUrlToBase64('http://62.68.146.39:4000/img/' + createGenDto.imageName);
    console.log('mask generated!')
    const requestData = {
      "init_images": [base64String],
      "resize_mode": 3,
      "width": 512,
      "height": 512,
      "denoising_strength": 0.75,
      "image_cfg_scale": 7,
      "mask": mask,
      "mask_blur": 0,
      "inpainting_fill": 1,
      "inpaint_full_res": true,
      "inpaint_full_res_padding": 32,
      "inpainting_mask_invert": 0,
      "initial_noise_multiplier": 0,
      "prompt": "nude, NSFW",
      "batch_size": 1,
      "steps": 20,
      "cfg_scale": 7,
      "override_settings": {},
      "override_settings_restore_afterwards": false,
      "script_args": [null, 64, "R-ESRGAN 4x+", 1.5],
      "sampler_index": "Euler a",
      "include_init_images": false,
      "send_images": true,
      "save_images": false,
      "alwayson_scripts": {
        "controlnet": {
          "args": [
            {
              "module": "openpose",
              "model": "control_v11p_sd15_openpose [cab727d4]"
            },
            {
              "module": "inpaint",
              "model": "control_v11p_sd15_inpaint [ebff9138]"
            },
          ]
        }
      }
    }
    const response = await this.httpService.post(requestURL, requestData).toPromise();
    const data = response.data.images[0];
    return data;
  }

  async faceSwap(someData: any) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_faceswap;
    const opt = {
      "image": someData.original,
      "units": [
        {
          "source_img": someData.userFace,
          "faces_index": [
            0
          ]
        }
      ],
      "postprocessing": {
        "face_restorer_name": "CodeFormer",
        "codeformer_weight": 0.5,
        "restorer_visibility": 1,
        "upscaler_name": "Lanczos",
        "scale": 4,
        "inpainting_when": "Before Upscaling/all",
        "inpainting_options": {
          "inpainting_steps": 30,
          "inpainting_denoising_strengh": 0.1
        }
      }
    }
    const response = await this.httpService.post(requestURL, opt).toPromise();
    const data = response.data.images[0];
    console.log('data access');
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

  async generateMask(imageName: string) {

    const pythonScriptPath = 'clothMask/process.py';
    const imagePath = 'public/img/' + imageName;

    const command = `python3 ${pythonScriptPath} --image ${imagePath}`;
    console.log(command);
    try {
      const base64Image = await this.executePythonScript(command).then((base64Image) => {
        return base64Image;
      });
      console.log('Python script output:', base64Image);
      return base64Image;
    } catch (error) {
      console.error(error);
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
