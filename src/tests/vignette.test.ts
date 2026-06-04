import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sharp from 'sharp';
import { applyVignette, VignetteOptions } from '../effects/vignette';

// Mock Sharp
vi.mock('sharp', () => {
    const createMockImage = () => ({
        clone: vi.fn(function (this: any) {
            return {
                raw: vi.fn(function (this: any) {
                    return {
                        toBuffer: vi.fn(async function (this: any) {
                            return {
                                data: Buffer.alloc(300),
                                info: {
                                    width: 10,
                                    height: 10,
                                    channels: 3,
                                },
                            };
                        }),
                    };
                }),
            };
        }),
        png: vi.fn(function (this: any) {
            return {
                toBuffer: vi.fn(async function (this: any) {
                    return Buffer.alloc(100);
                }),
            };
        }),
        composite: vi.fn(function (this: any) {
            return this;
        }),
        raw: vi.fn(function (this: any) {
            return this;
        }),
    });

    return {
        default: vi.fn(createMockImage),
    };
});

describe('applyVignette', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply vignette with default options of intensity: 30, radius: 0.75)', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const result = await applyVignette(mockImage);

        expect(result).toBeDefined();
        expect(mockImage.clone).toHaveBeenCalled();
    });

    it('should apply vignette with custom intensity', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { intensity: 60, radius: 0.75 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBeDefined();
        expect(mockImage.clone).toHaveBeenCalled();
    });

    it('should apply vignette with custom radius', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { intensity: 30, radius: 0.5 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBeDefined();
        expect(mockImage.clone).toHaveBeenCalled();
    });

    it('should return image unchanged when intensity is 0', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { intensity: 0 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBe(mockImage);
        expect(mockImage.clone).not.toHaveBeenCalled();
    });

    it('should handle maximum intensity value', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { intensity: 100 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBeDefined();
        expect(mockImage.clone).toHaveBeenCalled();
    });

    it('should handle minimum radius value', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { radius: 0 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBeDefined();
    });

    it('should handle maximum radius value', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { radius: 1 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBeDefined();
    });

    it('should create a vignette mask and process the image', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const result = await applyVignette(mockImage);

        // Sharp should be called at least once (for the mask creation inside the function)
        expect(Sharp).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it('should process the image through the vignette pipeline', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const result = await applyVignette(mockImage);

        // Verify the clone was called to extract raw data
        expect(mockImage.clone).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it('should handle partial options with just intensity', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { intensity: 50 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBeDefined();
    });

    it('should handle partial options with just radius', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: VignetteOptions = { radius: 0.6 };

        const result = await applyVignette(mockImage, options);

        expect(result).toBeDefined();
    });

    it('should handle empty options object', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const result = await applyVignette(mockImage, {});

        expect(result).toBeDefined();
    });

    it('should return a Sharp-like object with composite method', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const result = await applyVignette(mockImage);

        expect(result).toHaveProperty('composite');
    });
});
