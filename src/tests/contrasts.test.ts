import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sharp from 'sharp';
import { applyContrast, ContrastOptions } from '../effects/contrast';

// Mock Sharp
vi.mock('sharp', () => ({
    default: vi.fn(function () {
        const mockImage = {
            modulate: vi.fn(function (this: any) {
                return this;
            }),
            linear: vi.fn(function (this: any) {
                return this
            })
        };
        return mockImage;
    }),
}));

describe('Test Apply Contrast defaults', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('Test Apply Contrast Defaults to Zero', async () => {
        const mockImage = Sharp('test.jpg') as any
        const result = await applyContrast(mockImage)

        expect(result.modulate).toHaveBeenCalledWith({brightness: 1})
        expect(result.linear).not.toHaveBeenCalled()
        // expect(result.linear).toHaveBeenCalledWith({factor: 1, midpoint: 0})
    })
})

describe('Test Apply Contrast defaults', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('Test Apply Contrast Options', async () => {
        const mockImage = Sharp('test.jpg') as any
        const result = await applyContrast(mockImage, {
            contrast: 100,
            brightness: 100,
        })

        expect(result.modulate).toHaveBeenCalledWith({brightness: 2})
        expect(result.linear).toHaveBeenCalledWith(2, -128)
    })
})