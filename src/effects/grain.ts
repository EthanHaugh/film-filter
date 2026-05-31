import Sharp from 'sharp';

export interface GrainOptions {
  intensity?: number; // 0-100
  size?: number;      // grain particle size 1-5
}

/**
 * Apply Grain texture
 * Sharp doesn't have a feature for this (sad) 
 * so heres an implementation using random grain values
 */
export async function applyGrain(
  image: Sharp.Sharp,
  options: GrainOptions = {}
): Promise<Sharp.Sharp> {
  const { intensity = 25, size = 1 } = options;

  if (intensity === 0) return image;

  // We need to re-grab data cleanly
  const { data, info } = await image.clone().raw().toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);

  const grainStrength = (intensity / 100) * 60; // max ~60 out of 255

  for (let i = 0; i < pixels.length; i += info.channels) {
    // Generate noise value for this pixel
    const noise = (Math.random() - 0.5) * 2 * grainStrength;

    // Film grain is stronger in midtones than highlights/shadows
    // Get luminance of current pixel to weight the grain
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];
    const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

    // Bell-curve weight: peaks at midtone (128), falls off at shadows and highlights
    const midtoneWeight = 1 - Math.abs(luminance - 128) / 128;

    const weightedNoise = noise * midtoneWeight;

    // Apply noise to each channel
    pixels[i] = Math.min(255, Math.max(0, red + weightedNoise));
    pixels[i + 1] = Math.min(255, Math.max(0, green + weightedNoise));
    pixels[i + 2] = Math.min(255, Math.max(0, blue + weightedNoise));
  }

  // If size > 1, do a very subtle blur after grain to clump pixels slightly
  // This simulates larger grain particles without losing the texture
  let result = Sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: info.channels }
  });

  if (size > 1) {
    const clumpBlur = (size - 1) * 0.3; // 0.3 to 1.2 — subtle
    result = result.blur(clumpBlur);
  }

  return result;
}