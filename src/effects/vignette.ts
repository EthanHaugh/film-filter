import Sharp from 'sharp';

export interface VignetteOptions {
  intensity?: number; // 0-100, darkness of vignette
  radius?: number; // 0-1, where vignette starts (1 = edge, 0 = center)
}

export async function applyVignette(
  image: Sharp.Sharp,
  options: VignetteOptions = {}
): Promise<Sharp.Sharp> {
  const { intensity = 30, radius = 0.75 } = options;

  if (intensity === 0) return image;

  // Get dimensions from the actual resolved buffer, not metadata
  const { data, info } = await image.clone().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);

  const maskData = Buffer.alloc(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - centerX) / maxDist;
      const dy = (y - centerY) / maxDist;
      const dist = Math.sqrt(dx ** 2 + dy ** 2);

      const overRadius = (dist - radius);
      const clampedOver = Math.min(1, Math.max(0, overRadius));
      const smoothed = clampedOver ** 2;

      const darkAmount = smoothed * intensity;
      const maskValue = Math.round((1 - darkAmount) * 255);

      maskData[y * width + x] = maskValue;
    }
  }

  const vignetteMask = await Sharp(maskData, {
    raw: { width, height, channels: 1 }
  }).png().toBuffer();

  // Reconstruct from the raw buffer we already have to ensure dimensions are consistent
  return Sharp(data, { raw: { width, height, channels } })
    .composite([{ input: vignetteMask, blend: 'multiply' }]);
}