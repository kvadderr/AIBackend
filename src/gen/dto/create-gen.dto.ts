export class CreateGenDto {
    promptß: string;
    negative_prompt: string;
    restore_faces: boolean;
    steps: number;
    sampler_name: string;
    cfg_scale: number;
}
