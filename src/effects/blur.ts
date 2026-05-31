import Sharp from 'sharp';

export interface BlurOptions {
  sigma?: number; // Standard deviation of blur 
}

/**
 * Apply Gaussian blur to simulate lens softness or motion blur
 */
export async function applyBlur(
  image: Sharp.Sharp,
  options: BlurOptions = {}
): Promise<Sharp.Sharp> {
  const { sigma = 1.5 } = options;
  return image.blur(sigma);
}
