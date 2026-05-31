"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ilfordHP5 = void 0;
/**
 * Ilford HP5 - Classic black & white film stock
 * Known for: High contrast, fine grain, timeless look, deep blacks
 */
exports.ilfordHP5 = {
    colourGrade: {
        saturation: -100, // Full desaturation for B&W
        lightness: 0,
    },
    contrast: {
        contrast: 35, // High contrast for dramatic effect
        brightness: -5,
    },
    vignette: {
        intensity: 35,
        radius: 0.7,
    },
    grain: {
        intensity: 30,
        size: 1, // Fine grain typical of HP5
    },
};
//# sourceMappingURL=ilfordHP5.js.map