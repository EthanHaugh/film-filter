import Sharp from 'sharp';
import { applyBlur, BlurOptions } from './effects/blur';
import { applyGrain, GrainOptions } from './effects/grain';
import { applyVignette, VignetteOptions } from './effects/vignette';
import { applyContrast, ContrastOptions } from './effects/contrast';
import { applyColourGrade, ColourGradeOptions } from './effects/colourGrade';

export interface PipelineConfig {
  blur?: BlurOptions;
  grain?: GrainOptions;
  vignette?: VignetteOptions;
  contrast?: ContrastOptions;
  colourGrade?: ColourGradeOptions;
}

/**
 * Film filter pipeline applies effects in a specific order
 * Order matters for visual quality and performance
 */
export class FilmFilterPipeline {
  private config: PipelineConfig;

  constructor(config: PipelineConfig = {}) {
    this.config = config;
  }

  /**
   * Apply all configured effects to an image
   */
  async apply(inputPath: string, outputPath: string): Promise<void> {
    let image = Sharp(inputPath).rotate();

    // Apply effects in optimal order
    // 1. Color grading first 
    if (this.config.colourGrade) {
      image = await applyColourGrade(image, this.config.colourGrade);
    }

    // 2. Contrast adjustments
    if (this.config.contrast) {
      image = await applyContrast(image, this.config.contrast);
    }

    // 3. Vignette 
    if (this.config.vignette) {
      image = await applyVignette(image, this.config.vignette);
    }

    // 4. Grain 
    if (this.config.grain) {
      image = await applyGrain(image, this.config.grain);
    }

    // 5. Optional blur 
    if (this.config.blur) {
      image = await applyBlur(image, this.config.blur);
    }

    await image.toFile(outputPath);
  }

  /**
   * Apply effects to a buffer and return result
   */
  async applyToBuffer(inputBuffer: Buffer): Promise<Buffer> {
    let image = Sharp(inputBuffer).rotate();

    if (this.config.colourGrade) {
      image = await applyColourGrade(image, this.config.colourGrade);
    }

    if (this.config.contrast) {
      image = await applyContrast(image, this.config.contrast);
    }

    if (this.config.vignette) {
      image = await applyVignette(image, this.config.vignette);
    }

    if (this.config.grain) {
      image = await applyGrain(image, this.config.grain);
    }

    if (this.config.blur) {
      image = await applyBlur(image, this.config.blur);
    }

    return image.toBuffer();
  }

  /**
   * Update pipeline configuration
   */
  setConfig(config: Partial<PipelineConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
