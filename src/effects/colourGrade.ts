import Sharp from 'sharp';

export interface ColourGradeOptions {
  hue?: number; // -180 to 180, color shift
  saturation?: number; // -100 to 100
  lightness?: number; // -100 to 100
  temperature?: 'warm' | 'cool' | 'neutral'; // Color temperature preset
}

/**
 * Apply color grading to match film stock color characteristics
 * Film cameras typically have warm or cool tones
 */
export async function applyColourGrade(
  image: Sharp.Sharp,
  options: ColourGradeOptions = {}
): Promise<Sharp.Sharp> {
  let { hue = 0, saturation = 0, lightness = 0, temperature = 'neutral' } = options;

  if (temperature === 'warm') {
    hue = 15; // Shift towards yellow/orange
    saturation = 10;
  } else if (temperature === 'cool') {
    hue = -15; // Shift towards blue
    saturation = 5;
  }

  // Normalize saturation to Sharp's 0-2 scale (1 is normal)
  const saturationValue = 1 + saturation / 100;
  const lightnessValue = 1 + lightness / 100;

  return image.modulate({
    hue: hue,
    saturation: saturationValue,
    lightness: lightnessValue
  });
}
