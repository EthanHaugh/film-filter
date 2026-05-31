import Sharp from 'sharp';

export interface ContrastOptions {
  contrast?: number; // -100 to 100, negative reduces contrast, positive increases
  brightness?: number; // -100 to 100
}

/**
 * Adjust contrast and brightness to match film stock characteristics
 */
export async function applyContrast(
  image: Sharp.Sharp,
  options: ContrastOptions = {}
): Promise<Sharp.Sharp> {
  const { contrast = 0, brightness = 0 } = options;

  // Normalize brightness to Sharp's expected range (0.5 to 2)
  const brightnessValue = 1 + brightness / 100;

  let result = image.modulate({
    brightness: brightnessValue
  });

  // Apply contrast using levels if needed
  if (contrast !== 0) {
    // For contrast, we adjust by scaling pixel values
    // Positive contrast: stretch the range, negative: compress it
    const factor = 1 + contrast / 100;
    const midpoint = 128;
    
    result = result.linear(factor, midpoint - midpoint * factor);
  }

  return result;
}

