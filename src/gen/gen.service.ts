import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import * as sharp from 'sharp';

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

  async createNude(createGenDto: any) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_img2img;
    let base64String = createGenDto.mask;
    const mask = await this.generateMaskWithSDXL(base64String)
    const expandedMask = await this.expandMask(base64String, mask);
    if (base64String.startsWith('data:image/jpeg;base64,')) {
      base64String = base64String.replace('data:image/jpeg;base64,', '');
    } else if (base64String.startsWith('data:image/png;base64,')) {
      base64String = base64String.replace('data:image/png;base64,', '');
    } else if (base64String.startsWith('data:image/webp;base64,')) {
      base64String = base64String.replace('data:image/webp;base64,', '');
    } else if (base64String.startsWith('data:image/jpg;base64,')) {
      base64String = base64String.replace('data:image/jpg;base64,', '');
    }
    const buffer = Buffer.from(base64String, 'base64');
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;
    console.log(width)
    const requestData = {
      "init_images": [base64String],
      "mask": expandedMask,
      "resize_mode": 3,
      "inpainting_fill": 0,
      "inpainting_mask_invert": 0,
      "inpaint_full_res": 1,
      "inpaint_full_res_padding": 32,
      "mask_blur": 13,
      "prompt": "nude, NSFW",
      "negative_prompt": "cloth, bad anatomy",
      "width": 512,
      "height": 512,
      "steps": 60,
      "sampler_index": "Euler a",
      "override_settings": {
        "sd_model_checkpoint": "uberRealisticPornMerge_urpmv13Inpainting.safetensors [fe06753eee]",
        "sd_vae": "None"
      },
    }
    const response = await this.httpService.post(requestURL, requestData).toPromise();
    const data = response.data.images[0];
    return data;
  }

  async create(createGenDto: any) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_img2img;
    let base64String = await this.imageUrlToBase64('http://62.68.146.39:4000/img/' + createGenDto.imageName);
    const mask = await this.generateMaskWithSDXL(base64String)
    const expandedMask = await this.expandMask(base64String, mask);
    if (base64String.startsWith('data:image/jpeg;base64,')) {
      base64String = base64String.replace('data:image/jpeg;base64,', '');
    } else if (base64String.startsWith('data:image/png;base64,')) {
      base64String = base64String.replace('data:image/png;base64,', '');
    } else if (base64String.startsWith('data:image/webp;base64,')) {
      base64String = base64String.replace('data:image/webp;base64,', '');
    } else if (base64String.startsWith('data:image/jpg;base64,')) {
      base64String = base64String.replace('data:image/jpg;base64,', '');
    }
    const buffer = Buffer.from(base64String, 'base64');
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    // Определяем ориентацию изображения
    var isHorizontal = width > height;
    var targetWidth = 512;
    var targetHeight = 512;
    // Рассчитываем новые размеры пропорционально
    var newWidth, newHeight;
    if (isHorizontal) {
      newWidth = targetWidth;
      newHeight = (targetWidth / width) * height;
    } else {
      newWidth = (targetHeight / height) * width;
      newHeight = targetHeight;
    }
    const requestData = {
      "init_images": [base64String],
      "mask": expandedMask,
      "resize_mode": 2,
      "inpainting_fill": 0,
      "inpainting_mask_invert": 0,
      "inpaint_full_res": 0,
      "inpaint_full_res_padding": 32,
      "mask_blur": 20,
      "prompt": "nude, NSFW",
      "width": newWidth,
      "height": newHeight,
      "steps": 60,
      "sampler_index": "Euler a"
    }
    const response = await this.httpService.post(requestURL, requestData).toPromise();
    const data = response.data.images[0];
    return data;
  }

  async expandMask(image: string, mask: string) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_samdilate;
    const requestData = {
      "input_image": image,
      "mask": mask,
      "dilate_amount": 40
    }
    const response = await this.httpService.post(requestURL, requestData).toPromise();
    const data = response.data.mask;
    return data;
  }
  async generateMaskWithSDXL(image: string) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_sampredict;

    const requestData = {
      "sam_model_name": "sam_vit_h_4b8939.pth",
      "input_image": image,
      "dino_enabled": true,
      "dino_model_name": "GroundingDINO_SwinT_OGC (694MB)",
      "dino_text_prompt": "clothes",
      "dino_box_threshold": 0.3,
      "dino_preview_checkbox": false,
      "dino_preview_boxes_selection": [
        0
      ]
    }
    const response = await this.httpService.post(requestURL, requestData).toPromise();
    const data = response.data.masks[2];
    return data;
  }


  async colorizePhoto(someData: any) {
    const mask = await this.generateStratch(someData.image)
    let requestURL = process.env.SDXL_URL + process.env.SDXL_img2img;
    let requestURLDeodify = process.env.SDXL_URL + "deoldify/image";
    const requestData = {
      "init_images": [someData.image],
      "mask": mask,
      "resize_mode": 3,
      "inpainting_fill": 0,
      "inpainting_mask_invert": 0,
      "inpaint_full_res": 1,
      "inpaint_full_res_padding": 32,
      "steps": 40,
      "sampler_index": "Euler a",
    }
    const response = await this.httpService.post(requestURL, requestData).toPromise();
    const dataImage = response.data.images[0];
    const requestDataDeodify =
    {
      "input_image": dataImage,
      "render_factor": 35,
      "artistic": false
    }

    const responseDeodify = await this.httpService.post(requestURLDeodify, requestDataDeodify).toPromise();
    const dataImageDeodify = responseDeodify.data.image;
    return dataImageDeodify;
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
          ],
          "pre_inpainting": {
            "inpainting_denoising_strengh": 0,
            "inpainting_prompt": "Portrait of a [gender]",
            "inpainting_negative_prompt": "",
            "inpainting_steps": 20,
            "inpainting_sampler": "Euler",
            "inpainting_model": "Current",
            "inpainting_seed": -1
          },
          "swapping_options": {
            "face_restorer_name": "CodeFormer",
            "restorer_visibility": 1,
            "codeformer_weight": 1,
            "upscaler_name": "Lanczos",
            "improved_mask": false,
            "color_corrections": false,
            "sharpen": false,
            "erosion_factor": 1
          },
          "post_inpainting": {
            "inpainting_denoising_strengh": 0,
            "inpainting_prompt": "Portrait of a [gender]",
            "inpainting_negative_prompt": "",
            "inpainting_steps": 20,
            "inpainting_sampler": "Euler",
            "inpainting_model": "Current",
            "inpainting_seed": -1
          }
        }
      ]
    }
    const response = await this.httpService.post(requestURL, opt).toPromise();
    const data = response.data.images[0];
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

  async generateStratch(image: string) {
    const pythonScriptPath = 'stratch/detection.py';
    const command = `python3 ${pythonScriptPath} --test_path ${image} --GPU -1 --input_size full_size`;
    try {
      return  await this.executePythonScript(command).then((base64Image) => { return base64Image; });
    } catch (error) { console.log(error); throw new Error('Failed to generate mask.') }
  }

  async generateAnime(someData: any) {
    let requestURL = process.env.SDXL_URL + process.env.SDXL_txt2img;
    const buffer = Buffer.from(someData.image, 'base64');
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    const overrice = someData.isReal ?
      {
        "override_settings": {
          "sd_vae": "vae-ft-mse-840000-ema-pruned_fp16.safetensors",
          "sd_model_checkpoint": "aniverse_v16Pruned.safetensors [838643492f]"
        }
      }
      :
      {
        "override_settings": {
          "sd_vae": "None",
          "sd_model_checkpoint": "animePastelDream_softBakedVae.safetensors [4be38c1a17]"
        }
      }

    const opt = {
      overrice,
      "prompt": "masterpiece, best quality, (colorful), " + someData.prompt + " ((ULTRA HD)),cinematic lighting, ((8K)), <lora:more_details:0.55>",
      "negative_prompt": "(worst quality:1.4), (low quality:1.4), (monochrome:1.1), fcNeg-neg, bad-hands-5,bad-artist-anime, bad-image-v2-27000,bad_prompt_version2, bad_quality, verybadimagenegative_v1.1-4800, FastNegativeEmbedding, FastNegativeV2, watermark, font, text, username, patreon username, patreon logo, censored, bar censor",
      "steps": 40,
      "cfg_scale": 7,
      "restore_faces": true,
      "width": width,
      "height": height,
      "denoising_strength": 0,
      "override_settings": {
        "sd_vae": "vae-ft-mse-840000-ema-pruned_fp16.safetensors",
        "sd_model_checkpoint": "aniverse_v16Pruned.safetensors [838643492f]"
      },
      "alwayson_scripts": {
        "controlnet": {
          "args": [
            {
              "input_image": someData.image,
              "module": "canny",
              "model": "control_v11p_sd15_canny [d14c016b]"
            }
          ]
        }
      }
    }
    const response = await this.httpService.post(requestURL, opt).toPromise();
    const data = response.data.images[0];
    return data;
  }


}
