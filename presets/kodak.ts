import { PipelineConfig } from '../src/pipeline';

/**
 * Kodak Portra - Warm, vintage-looking color film stock
 * Known for: Warm tones, smooth gradations, reduced saturation, nostalgic feel
 */
export const kodak: PipelineConfig = {
  colourGrade: {
    temperature: 'warm',
    saturation: -8,
    hue: 10,
    lightness: 5,
  },
  contrast: {
    contrast: 5, 
    brightness: 8,
  },
  vignette: {
    intensity: 12,
    radius: 0.72,
  },
  grain: {
    intensity: 30,
    size: 2,
  },
};
