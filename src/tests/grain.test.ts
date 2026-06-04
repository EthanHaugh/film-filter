import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sharp from 'sharp';
import { applyGrain, GrainOptions } from '../effects/grain';

// Mock Sharp
vi.mock('sharp', () => {
    const createMockImage = () => ({
        clone: vi.fn(function (this: any) {
            return {
                raw: vi.fn(function (this: any) {
                    return {
                        toBuffer: vi.fn(async function (this: any) {
                            return {
                                data: Buffer.alloc(100),
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
        blur: vi.fn(function (this: any) {
            return this;
        }),
    });

    return {
        default: vi.fn(createMockImage),
    };
});

describe('Test applyGrain Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply grain with default options (intensity: 25, size: 1)', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const result = await applyGrain(mockImage);

        expect(result).toBeDefined();
        expect(mockImage.clone).toHaveBeenCalled();
    });

    it('should apply grain with custom intensity', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: GrainOptions = { intensity: 50, size: 1 };

        const result = await applyGrain(mockImage, options);

        expect(result).toBeDefined();
        expect(mockImage.clone).toHaveBeenCalled();
    });

    it('should apply grain with custom size and process pixels', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: GrainOptions = { intensity: 25, size: 3 };

        const result = await applyGrain(mockImage, options);

        expect(result).toBeDefined();
        // When size > 1, a new Sharp instance is created with the processed pixels
        // So Sharp is called once by the test, and again inside the function
        expect(Sharp).toHaveBeenCalledTimes(2);
    });

    it('should drop out when intensity is 0', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: GrainOptions = { intensity: 0 };

        const result = await applyGrain(mockImage, options);

        expect(result).toBe(mockImage);
        expect(mockImage.clone).not.toHaveBeenCalled();
        expect(mockImage.blur).not.toHaveBeenCalled();
    });

    it('should handle maximum intensity value', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: GrainOptions = { intensity: 100 };

        const result = await applyGrain(mockImage, options);

        expect(result).toBeDefined();
        expect(mockImage.clone).toHaveBeenCalled();
    });

    it('should handle maximum size value', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const options: GrainOptions = { size: 5 };

        const result = await applyGrain(mockImage, options);

        expect(result).toBeDefined();
    });

    it('should return a Sharp-like object', async () => {
        const mockImage = Sharp('test.jpg') as any;
        const result = await applyGrain(mockImage);

        expect(result).toHaveProperty('clone');
        expect(result).toHaveProperty('blur');
    });
});