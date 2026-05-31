// Export pipeline and configuration
export { FilmFilterPipeline, PipelineConfig } from './pipeline';

// Export individual effects
export { applyBlur, BlurOptions } from './effects/blur';
export { applyGrain, GrainOptions } from './effects/grain';
export { applyVignette, VignetteOptions } from './effects/vignette';
export { applyContrast, ContrastOptions } from './effects/contrast';
export { applyColourGrade, ColourGradeOptions } from './effects/colourGrade';

// Export presets
export { fujiSupertia } from '../presets/fujiSupertia';
export { ilfordHP5 } from '../presets/ilfordHP5';
export { kodak } from '../presets/kodak';

// Main API
export async function applyFilmFilter(
  inputPath: string,
  outputPath: string,
  preset: 'fujiSupertia' | 'ilfordHP5' | 'kodak',
  customConfig?: Partial<import('./pipeline').PipelineConfig>
): Promise<void> {
  let { FilmFilterPipeline } = await import('./pipeline');
  let presetConfig;

  switch (preset) {
    case 'fujiSupertia':
      presetConfig = (await import('../presets/fujiSupertia')).fujiSupertia;
      break;
    case 'ilfordHP5':
      presetConfig = (await import('../presets/ilfordHP5')).ilfordHP5;
      break;
    case 'kodak':
      presetConfig = (await import('../presets/kodak')).kodak;
      break;
    default:
      throw new Error(`Unknown preset: ${preset}`);
  }

  const finalConfig = { ...presetConfig, ...customConfig };
  const pipeline = new FilmFilterPipeline(finalConfig);
  await pipeline.apply(inputPath, outputPath);
}
