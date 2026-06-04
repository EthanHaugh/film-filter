import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sharp from 'sharp';
import { applyColourGrade, ColourGradeOptions } from '../effects/colourGrade';

// Mock Sharp
vi.mock('sharp', () => ({
    default: vi.fn(function () {
        const mockImage = {
            modulate: vi.fn(function (this: any) {
                return this;
            })
        };
        return mockImage;
    }),
}));

describe("Test Colour Grade Tempurature Functionality", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply default values based on neutral tempurature', async () => {
        const mockImage = Sharp('./test.jpg') as any
        const result = await applyColourGrade(mockImage)

        expect(mockImage.modulate).toHaveBeenCalledWith({
            hue: 0,
            saturation: 1,
            lightness: 1,
        })
    });

    it('should apply default values based on warm tempurature', async () => {
        const mockImage = Sharp('./test.jpg') as any
        const result = await applyColourGrade(mockImage, {temperature: 'warm'})

        expect(mockImage.modulate).toHaveBeenCalledWith({
            hue: 15,
            saturation: 1.1,
            lightness: 1,
        })
    });

    it('should apply default values based on cool tempurature', async () => {
        const mockImage = Sharp('./test.jpg') as any
        const result = await applyColourGrade(mockImage, {temperature: 'cool'})

        expect(mockImage.modulate).toHaveBeenCalledWith({
            hue: -15,
            saturation: 1.05,
            lightness: 1,
        })
    });
});

describe("Test Colour Grade Options Functionality", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply default values based on neutral tempurate', async () => {
        const mockImage = Sharp('./test.jpg') as any
        const result = await applyColourGrade(mockImage, {
            hue: 100,
            saturation: 100,
            lightness: 100,
        })

        expect(mockImage.modulate).toHaveBeenCalledWith({
            hue: 100,
            saturation: 2,
            lightness: 2,
        })
    });
});