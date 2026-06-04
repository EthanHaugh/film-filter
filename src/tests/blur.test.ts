import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sharp from 'sharp';
import { applyBlur, BlurOptions } from '../effects/blur';

// Mock Sharp
vi.mock('sharp', () => ({
  default: vi.fn(function() {
    const mockImage = {
      blur: vi.fn(function(this: any) {
        return this;
      }),
      rotate: vi.fn(function(this: any) {
        return this;
      }),
    };
    return mockImage;
  }),
}));

describe('applyBlur', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply default blur with sigma of 1.5', async () => {
    const mockImage = Sharp('./test.jpg') as any;
    const result = await applyBlur(mockImage);

    expect(mockImage.blur).toHaveBeenCalledWith(1.5);
    expect(result).toBeDefined();
  });

  it('should apply custom sigma value', async () => {
    const mockImage = Sharp('./test.jpg') as any;
    const options: BlurOptions = { sigma: 2.5 };

    await applyBlur(mockImage, options);

    expect(mockImage.blur).toHaveBeenCalledWith(2.5);
  });

  it('should handle zero sigma', async () => {
    const mockImage = Sharp('./test.jpg') as any;
    const options: BlurOptions = { sigma: 0 };

    await applyBlur(mockImage, options);

    expect(mockImage.blur).toHaveBeenCalledWith(0);
  });

  it('should return the image object for chaining', async () => {
    const mockImage = Sharp('./test.jpg') as any;
    const result = await applyBlur(mockImage);

    expect(result).toEqual(mockImage);
  });
});
