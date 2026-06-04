# Film Filter

Convert digital photos (like iPhone photos) to look like they were taken on classic film cameras. This library applies authentic film emulation effects including color grading, grain, vignetting, and contrast adjustments.

Python is probably the best language this could've been written in, but this was a nice challenge.

## Table of Contents

- [Examples](#examples)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Presets](#presets)
- [Testing](#testing)

<details>

<summary>Examples</summary>

## Input Image
![alt text](images/input.jpg "Input Image")

<details>
<summary>Kodak</summary>

![alt text](images/kodak.jpg "Kodak Output")

</details>

<details>
<summary>Ilford</summary>

![alt text](images/ilford.jpg "Ilford Output")

</details>

<details>
<summary>Fuji</summary>

![alt text](images/fuji.jpg "Fuji Output")

</details>
</details>


## Features

- **Film Stock Presets**: Ready-to-use presets for classic film stocks
  - **Fujifilm Superia**: Warm, saturated, vibrant colors
  - **Ilford HP5**: Classic black & white with high contrast
  - **Kodak Portra**: Warm, vintage, reduced saturation
- **Individual Effects**: Apply effects independently for custom workflows
- **Pipeline Architecture**: Chain effects in optimal order for best results
- **Buffer Support**: Process images from buffers or files

## Quick Start

### Running via CLI

```
node -e "require('./dist/src/index.js').applyFilmFilter('<IMAGE-PATH>', '<OUTPUT-PATH>', '<PRESET>').then(() => console.log('Done!'))"
```

Valid preset values:
1. `fujiSupertia`
2. `ilfordHP5`
3. `kodak`

### Using Presets

```javascript
const { applyFilmFilter } = require('./dist/src/index.js');

// Apply Fuji Superia preset
await applyFilmFilter('input.jpg', 'output.jpg', 'fujiSupertia');

// Apply Ilford HP5 (B&W)
await applyFilmFilter('input.jpg', 'output.jpg', 'ilfordHP5');

// Apply Kodak Portra
await applyFilmFilter('input.jpg', 'output.jpg', 'kodak');
```

### Custom Configuration

```javascript
const { applyFilmFilter } = require('./dist/src/index.js');

await applyFilmFilter('input.jpg', 'output.jpg', 'fujiSupertia', {
  grain: { intensity: 40, size: 3 },
  vignette: { intensity: 50, radius: 0.8 }
});
```

### Using the Pipeline Directly

```javascript
const { FilmFilterPipeline } = require('./dist/src/pipeline.js');
const { fujiSupertia } = require('./dist/presets/fujiSupertia.js');

const pipeline = new FilmFilterPipeline(fujiSupertia);
await pipeline.apply('input.jpg', 'output.jpg');
```

### Applying Individual Effects

```javascript
const Sharp = require('sharp');
const { applyGrain, applyVignette, applyColourGrade } = require('./dist/src/effects/grain.js');

let image = Sharp('input.jpg');
image = await applyColourGrade(image, { temperature: 'warm', saturation: 15 });
image = await applyGrain(image, { intensity: 20, size: 2 });
image = await applyVignette(image, { intensity: 25, radius: 0.75 });
await image.toFile('output.jpg');
```

## API Reference

### Main Function

#### `applyFilmFilter(inputPath, outputPath, preset, customConfig?)`

Apply a film stock preset with optional custom overrides.

- **inputPath** (string): Path to input image
- **outputPath** (string): Path to save output image
- **preset** ('fujiSupertia' | 'ilfordHP5' | 'kodak'): Film stock preset name
- **customConfig** (PipelineConfig, optional): Custom effect configuration to override preset

### FilmFilterPipeline

#### Constructor

```javascript
new FilmFilterPipeline(config?: PipelineConfig)
```

#### Methods

- **`apply(inputPath: string, outputPath: string): Promise<void>`**
  Apply effects and save to file

- **`applyToBuffer(inputBuffer: Buffer): Promise<Buffer>`**
  Apply effects and return result as buffer

- **`setConfig(config: Partial<PipelineConfig>): void`**
  Update pipeline configuration

### Effects

#### Color Grade

```javascript
applyColourGrade(image, {
  hue: -15,           // -180 to 180
  saturation: 10,     // -100 to 100
  lightness: 0,       // -100 to 100
  temperature: 'warm' // 'warm' | 'cool' | 'neutral'
})
```

#### Grain

```javascript
applyGrain(image, {
  intensity: 25, // 0-100
  size: 2        // 1-5
})
```

#### Vignette

```javascript
applyVignette(image, {
  intensity: 30, // 0-100
  radius: 0.7    // 0-1
})
```

#### Contrast

```javascript
applyContrast(image, {
  contrast: 10,   // -100 to 100
  brightness: 5   // -100 to 100
})
```

#### Blur

```javascript
applyBlur(image, {
  sigma: 1.5 // 0.3 to 1000
})
```

## Presets

### Fujifilm Superia

Warm and vibrant, with increased saturation and magenta/green character.

```javascript
{
  colourGrade: { temperature: 'warm', saturation: 15, hue: 5 },
  contrast: { contrast: 10, brightness: 5 },
  vignette: { intensity: 20, radius: 0.75 },
  grain: { intensity: 15, size: 2 }
}
```

### Ilford HP5

Classic high-contrast black and white with fine grain.

```javascript
{
  colourGrade: { saturation: -100, lightness: 0 },
  contrast: { contrast: 35, brightness: -5 },
  vignette: { intensity: 35, radius: 0.7 },
  grain: { intensity: 30, size: 1 }
}
```

### Kodak Portra

Warm, smooth, and vintage-looking with reduced saturation.

```javascript
{
  colourGrade: { temperature: 'warm', saturation: -8, hue: 10, lightness: 5 },
  contrast: { contrast: 5, brightness: 8 },
  vignette: { intensity: 25, radius: 0.72 },
  grain: { intensity: 12, size: 2 }
}
```

## Examples

### Create a Custom Film Look

```javascript
const { FilmFilterPipeline } = require('./dist/src/pipeline.js');

const customConfig = {
  colourGrade: {
    temperature: 'warm',
    saturation: 20,
    hue: 10
  },
  contrast: {
    contrast: 15,
    brightness: 3
  },
  vignette: {
    intensity: 40,
    radius: 0.75
  },
  grain: {
    intensity: 22,
    size: 2
  }
};

const pipeline = new FilmFilterPipeline(customConfig);
await pipeline.apply('photo.jpg', 'film_photo.jpg');
```

### Batch Process Images

```javascript
const fs = require('fs');
const path = require('path');
const { applyFilmFilter } = require('./dist/src/index.js');

async function batchProcess(inputDir, outputDir, preset) {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpg|png)$/i.test(f));
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, `film_${file}`);
    await applyFilmFilter(inputPath, outputPath, preset);
    console.log(`Processed: ${file}`);
  }
}

await batchProcess('./photos', './output', 'fujiSupertia');
```

## Project Structure

```
film-filter/
├── src/
│   ├── index.ts              # Main exports
│   ├── pipeline.ts           # Effect pipeline orchestrator
│   ├── effects/
│   │   ├── blur.ts           # Gaussian blur effect
│   │   ├── colourGrade.ts    # Color grading effect
│   │   ├── contrast.ts       # Contrast adjustment
│   │   ├── grain.ts          # Film grain effect
│   │   └── vignette.ts       # Vignette effect
│   └── tests/
│       ├── blur.test.ts
│       ├── colourGrade.test.ts
│       ├── contrasts.test.ts
│       ├── grain.test.ts
│       ├── pipeline.test.ts
│       ├── presets.test.ts
│       └── vignette.test.ts
├── presets/
│   ├── fujiSupertia.ts       # Fujifilm Superia preset
│   ├── ilfordHP5.ts          # Ilford HP5 preset
│   └── kodak.ts              # Kodak Portra preset
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit testing. The test suite covers all effects, presets, and the pipeline orchestration with 100% coverage. 

### Running Tests

Tests run automatically as part of the pre-commit hook. To enable the pre-commit hook, run:

```bash
git config --local core.hooksPath .githooks/
```

This tells git to use the hooks in the `.githooks/` directory. After setting this up, tests will run before every commit and block commits with failing tests.

To run tests manually:

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm test:run

# View test results in interactive UI
npm test:ui

# Generate coverage report
npm test:coverage
```

### Test Coverage

The project includes comprehensive tests for:

- **Effects** (`src/tests/effects/*.test.ts`): Unit tests for blur, grain, vignette, color grade, and contrast effects
- **Pipeline** (`src/tests/pipeline.test.ts`): Tests for the `apply()` and `applyToBuffer()` methods, effect ordering, and configuration management
- **Presets** (`src/tests/presets.test.ts`): Validation of film stock preset definitions

All test files should be placed in `src/tests/` and follow the naming convention `*.test.ts` or `*.spec.ts`.
