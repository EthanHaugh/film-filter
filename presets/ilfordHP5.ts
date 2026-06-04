import { PipelineConfig } from '../src/pipeline';

/**
 * Ilford HP5 - Classic black & white film stock
 * Known for: High contrast, fine grain, timeless look, deep blacks
 */
export const ilfordHP5: PipelineConfig = {
  colourGrade: {
    saturation: -100, 
    lightness: 0,
  },
  contrast: {
    contrast: 35, 
    brightness: -5,
  },
  vignette: {
    intensity: 5,
    radius: 0.7,
  },
  grain: {
    intensity: 300,
    size: 1, 
  },
};
