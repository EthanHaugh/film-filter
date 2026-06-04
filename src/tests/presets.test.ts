import { describe, it, expect } from 'vitest';
import { fujiSupertia } from '../../presets/fujiSupertia';
import { ilfordHP5 } from '../../presets/ilfordHP5';
import { kodak } from '../../presets/kodak';

describe('Film Presets', () => {
    it('fujiSupertia preset should be defined', () => {
        expect(fujiSupertia).toBeDefined();
        expect(typeof fujiSupertia).toBe('object');
    });

    it('ilfordHP5 preset should be defined', () => {
        expect(ilfordHP5).toBeDefined();
        expect(typeof ilfordHP5).toBe('object');
    });

    it('kodak preset should be defined', () => {
        expect(kodak).toBeDefined();
        expect(typeof kodak).toBe('object');
    });

    it('presets should have configuration properties', () => {
        expect(fujiSupertia).toStrictEqual({
            colourGrade: {
                temperature: 'warm',
                saturation: 15,
                hue: 5,
            },
            contrast: {
                contrast: 10,
                brightness: 5,
            },
            vignette: {
                intensity: 10,
                radius: 0.75,
            },
            grain: {
                intensity: 30,
                size: 2,
            },
        })

        expect(ilfordHP5).toStrictEqual({
            colourGrade: {
                saturation: -100,
                lightness: 0,
            },
            contrast: {
                contrast: 35,
                brightness: -5,
            },
            vignette: {
                intensity: 5,
                radius: 0.7,
            },
            grain: {
                intensity: 300,
                size: 1,
            },
        })

        expect(kodak).toStrictEqual({
            colourGrade: {
                temperature: 'warm',
                saturation: -8,
                hue: 10,
                lightness: 5,
            },
            contrast: {
                contrast: 5,
                brightness: 8,
            },
            vignette: {
                intensity: 12,
                radius: 0.72,
            },
            grain: {
                intensity: 30,
                size: 2,
            },
        })
    });
});
