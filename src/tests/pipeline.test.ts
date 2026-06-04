import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilmFilterPipeline, PipelineConfig } from '../pipeline';
import Sharp from 'sharp';

// Mock Sharp
vi.mock('sharp', () => {
  const createMockImage = () => ({
    rotate: vi.fn(function (this: any) {
      return this;
    }),
    toFile: vi.fn(async function (this: any) {
      return { size: 1000 };
    }),
    toBuffer: vi.fn(async function (this: any) {
      return Buffer.alloc(1000);
    }),
  });

  return {
    default: vi.fn(createMockImage),
  };
});

// Mock effect functions
vi.mock('../effects/blur', () => ({
  applyBlur: vi.fn(async (image) => image),
}));

vi.mock('../effects/grain', () => ({
  applyGrain: vi.fn(async (image) => image),
}));

vi.mock('../effects/vignette', () => ({
  applyVignette: vi.fn(async (image) => image),
}));

vi.mock('../effects/contrast', () => ({
  applyContrast: vi.fn(async (image) => image),
}));

vi.mock('../effects/colourGrade', () => ({
  applyColourGrade: vi.fn(async (image) => image),
}));

describe('FilmFilterPipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default config', () => {
    const pipeline = new FilmFilterPipeline();
    expect(pipeline).toBeDefined();
  });

  it('should initialize with custom config', () => {
    const config: PipelineConfig = {
      blur: { sigma: 2 },
      grain: { intensity: 0.5 },
      contrast: { contrast: 1.2 },
    };
    const pipeline = new FilmFilterPipeline(config);
    expect(pipeline).toBeDefined();
  });

  it('should accept all effect types in config', () => {
    const config: PipelineConfig = {
      blur: { sigma: 1 },
      grain: { intensity: 0.3 },
      vignette: { intensity: 0.4 },
      contrast: { contrast: 1.1 },
      colourGrade: { lightness: -10, saturation: 0, hue: 10 },
    };
    const pipeline = new FilmFilterPipeline(config);
    expect(pipeline).toBeDefined();
  });

  it('should handle empty config', () => {
    const pipeline = new FilmFilterPipeline({});
    expect(pipeline).toBeDefined();
  });

  it('should handle partial config', () => {
    const config: PipelineConfig = {
      blur: { sigma: 2.5 },
    };
    const pipeline = new FilmFilterPipeline(config);
    expect(pipeline).toBeDefined();
  });

  describe('apply method', () => {
    it('should apply filters to a file and save output', async () => {
      const config: PipelineConfig = {
        blur: { sigma: 1.5 },
        grain: { intensity: 0.5 },
      };
      const pipeline = new FilmFilterPipeline(config);

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(Sharp).toHaveBeenCalledWith('./input.jpg');
      const mockImage = (Sharp as any).mock.results[0].value;
      expect(mockImage.rotate).toHaveBeenCalled();
      expect(mockImage.toFile).toHaveBeenCalledWith('./output.jpg');
    });

    it('should apply all effects when configured', async () => {
      const config: PipelineConfig = {
        colourGrade: { lightness: -10 },
        contrast: { contrast: 1.2 },
        vignette: { intensity: 30 },
        grain: { intensity: 0.5 },
        blur: { sigma: 1.5 },
      };
      const pipeline = new FilmFilterPipeline(config);
      const { applyColourGrade } = await import('../effects/colourGrade');
      const { applyContrast } = await import('../effects/contrast');
      const { applyVignette } = await import('../effects/vignette');
      const { applyGrain } = await import('../effects/grain');
      const { applyBlur } = await import('../effects/blur');

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(Sharp).toHaveBeenCalled();
      expect(applyColourGrade).toHaveBeenCalled();
      expect(applyContrast).toHaveBeenCalled();
      expect(applyVignette).toHaveBeenCalled();
      expect(applyGrain).toHaveBeenCalled();
      expect(applyBlur).toHaveBeenCalled();
    });

    it('should skip effects that are not configured', async () => {
      const config: PipelineConfig = {
        blur: { sigma: 1.5 },
      };
      const pipeline = new FilmFilterPipeline(config);
      const { applyColourGrade } = await import('../effects/colourGrade');
      const { applyGrain } = await import('../effects/grain');

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(applyColourGrade).not.toHaveBeenCalled();
      expect(applyGrain).not.toHaveBeenCalled();
    });

    it('should apply effects in the correct order', async () => {
      const callOrder: string[] = [];
      const config: PipelineConfig = {
        colourGrade: { lightness: -10 },
        contrast: { contrast: 1.2 },
        vignette: { intensity: 30 },
        grain: { intensity: 0.5 },
        blur: { sigma: 1.5 },
      };
      const pipeline = new FilmFilterPipeline(config);

      // Track call order
      vi.mocked(Sharp).mockImplementation(() => {
        const mockImage = {
          rotate: vi.fn(function (this: any) {
            callOrder.push('rotate');
            return this;
          }),
          toFile: vi.fn(async () => ({ size: 1000 })),
          toBuffer: vi.fn(async () => Buffer.alloc(1000)),
        };
        return mockImage as any;
      });

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(callOrder).toContain('rotate');
    });

    it('should handle files without any effects', async () => {
      const pipeline = new FilmFilterPipeline({});

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(Sharp).toHaveBeenCalledWith('./input.jpg');
      const mockImage = (Sharp as any).mock.results[0].value;
      expect(mockImage.toFile).toHaveBeenCalledWith('./output.jpg');
    });
  });

  describe('applyToBuffer method', () => {
    it('should apply filters to a buffer and return result', async () => {
      const config: PipelineConfig = {
        blur: { sigma: 1.5 },
      };
      const pipeline = new FilmFilterPipeline(config);
      const inputBuffer = Buffer.from('test');

      const result = await pipeline.applyToBuffer(inputBuffer);

      expect(Sharp).toHaveBeenCalledWith(inputBuffer);
      expect(result).toBeInstanceOf(Buffer);
    });

    it('should apply all effects to buffer', async () => {
      const config: PipelineConfig = {
        colourGrade: { lightness: -10 },
        contrast: { contrast: 1.2 },
        vignette: { intensity: 30 },
        grain: { intensity: 0.5 },
        blur: { sigma: 1.5 },
      };
      const pipeline = new FilmFilterPipeline(config);
      const { applyColourGrade } = await import('../effects/colourGrade');
      const { applyContrast } = await import('../effects/contrast');
      const { applyVignette } = await import('../effects/vignette');
      const { applyGrain } = await import('../effects/grain');
      const { applyBlur } = await import('../effects/blur');

      const inputBuffer = Buffer.from('test');
      await pipeline.applyToBuffer(inputBuffer);

      expect(applyColourGrade).toHaveBeenCalled();
      expect(applyContrast).toHaveBeenCalled();
      expect(applyVignette).toHaveBeenCalled();
      expect(applyGrain).toHaveBeenCalled();
      expect(applyBlur).toHaveBeenCalled();
    });

    it('should skip unconfigured effects in buffer mode', async () => {
      const config: PipelineConfig = {
        blur: { sigma: 1.5 },
      };
      const pipeline = new FilmFilterPipeline(config);
      const { applyVignette } = await import('../effects/vignette');

      const inputBuffer = Buffer.from('test');
      await pipeline.applyToBuffer(inputBuffer);

      expect(applyVignette).not.toHaveBeenCalled();
    });

    it('should return a buffer', async () => {
      const pipeline = new FilmFilterPipeline({});
      const inputBuffer = Buffer.from('test');

      const result = await pipeline.applyToBuffer(inputBuffer);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle buffer without any effects', async () => {
      const pipeline = new FilmFilterPipeline({});
      const inputBuffer = Buffer.from('test');

      const result = await pipeline.applyToBuffer(inputBuffer);

      expect(Sharp).toHaveBeenCalledWith(inputBuffer);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe('setConfig method', () => {
    it('should update configuration', async () => {
      const pipeline = new FilmFilterPipeline({ blur: { sigma: 1 } });
      const newConfig: PipelineConfig = { blur: { sigma: 2 }, grain: { intensity: 0.5 } };

      pipeline.setConfig(newConfig);
      const { applyBlur } = await import('../effects/blur');

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(applyBlur).toHaveBeenCalled();
    });

    it('should merge partial config with existing config', async () => {
      const initialConfig: PipelineConfig = { blur: { sigma: 1 } };
      const pipeline = new FilmFilterPipeline(initialConfig);

      const additionalConfig: PipelineConfig = { grain: { intensity: 0.5 } };
      pipeline.setConfig(additionalConfig);

      const { applyBlur } = await import('../effects/blur');
      const { applyGrain } = await import('../effects/grain');

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(applyBlur).toHaveBeenCalled();
      expect(applyGrain).toHaveBeenCalled();
    });

    it('should override existing config values', async () => {
      const initialConfig: PipelineConfig = { blur: { sigma: 1 } };
      const pipeline = new FilmFilterPipeline(initialConfig);

      const newConfig: PipelineConfig = { blur: { sigma: 5 } };
      pipeline.setConfig(newConfig);

      await pipeline.apply('./input.jpg', './output.jpg');

      expect(Sharp).toHaveBeenCalled();
    });
  });
});
