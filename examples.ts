/**
 * Example usage of the film-filter library
 * Demonstrates applying various film presets and custom configurations
 */

import { 
  applyFilmFilter, 
  FilmFilterPipeline,
  fujiSupertia,
  ilfordHP5,
  kodak
} from './src/index';

async function examples() {
  // Example 1: Apply Fuji Superia preset
  console.log('Applying Fuji Superia preset...');
  await applyFilmFilter('sample.jpg', 'output-fuji.jpg', 'fujiSupertia');

  // Example 2: Apply Ilford HP5 (B&W)
  console.log('Applying Ilford HP5 preset...');
  await applyFilmFilter('sample.jpg', 'output-hp5.jpg', 'ilfordHP5');

  // Example 3: Apply Kodak with custom overrides
  console.log('Applying Kodak with custom grain...');
  await applyFilmFilter('sample.jpg', 'output-kodak-custom.jpg', 'kodak', {
    grain: { intensity: 40, size: 3 },
    vignette: { intensity: 50 }
  });

  // Example 4: Using pipeline directly
  console.log('Using pipeline directly...');
  const pipeline = new FilmFilterPipeline(fujiSupertia);
  await pipeline.apply('sample.jpg', 'output-pipeline.jpg');

  // Example 5: Custom configuration
  console.log('Applying custom configuration...');
  const customConfig = {
    colourGrade: {
      temperature: 'cool' as const,
      saturation: -20,
      hue: -10
    },
    contrast: {
      contrast: 20,
      brightness: -3
    },
    vignette: {
      intensity: 35,
      radius: 0.8
    },
    grain: {
      intensity: 18,
      size: 2
    }
  };
  
  const customPipeline = new FilmFilterPipeline(customConfig);
  await customPipeline.apply('sample.jpg', 'output-custom.jpg');
}

// Run examples if this file is executed directly
if (require.main === module) {
  examples().catch(err => console.error('Error:', err));
}

export { examples };
