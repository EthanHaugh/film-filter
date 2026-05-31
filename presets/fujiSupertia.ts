import { PipelineConfig } from '../src/pipeline';

/**
 * Fujifilm Superia - Warm, saturated color film stock
 * Known for: Vibrant greens and magentas, warm skin tones, slight vignette
 */
export const fujiSupertia: PipelineConfig = {
  colourGrade: {
    temperature: 'warm',
    saturation: 15,
    hue: 5,
  },
  contrast: {
    contrast: 10,
    brightness: 5,
  },
  vignette: {
    intensity: 10,
    radius: 0.75,
  },
  grain: {
    intensity: 30,
    size: 2,
  },
};
