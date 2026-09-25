import shadows, { shadowSizes, SHADOW_COLOR_VAR } from './shadows';

const layerColor = `rgb(from var(${SHADOW_COLOR_VAR}) r g b / `;

const layerAlphas = (shadow: string) => shadow
  .split(layerColor).slice(1)
  .map(part => part.slice(0, part.indexOf(')')));

describe('styles / theme / createTheme / shadows', () => {
  describe('shadows', () => {
    it('exposes 25 elevations starting with none', () => {
      expect(shadows).toHaveLength(25);
      expect(shadows[0]).toBe('none');
    });

    it('draws every elevation with three layers reading the shadow color variable', () => {
      shadows.slice(1).forEach((shadow) => {
        expect(shadow.split(layerColor).length - 1).toBe(3);
      });
    });

    it('keeps the layer opacities fixed at 0.2 / 0.14 / 0.12 across elevations', () => {
      expect(layerAlphas(shadows[2])).toEqual(['0.2', '0.14', '0.12']);
      expect(layerAlphas(shadows[8])).toEqual(['0.2', '0.14', '0.12']);
    });

    it('gives every elevation a distinct shadow', () => {
      expect(new Set(shadows.slice(1)).size).toBe(24);
    });

    it('carries the color inline instead of a shadow scale variable', () => {
      expect(shadows[4]).not.toContain('var(--sg-shadows');
    });
  });

  describe('shadowSizes', () => {
    it('maps each admin-offered size to its elevation on the scale', () => {
      expect(shadowSizes.none).toBe(shadows[0]);
      expect(shadowSizes.low).toBe(shadows[2]);
      expect(shadowSizes.medium).toBe(shadows[4]);
      expect(shadowSizes.strong).toBe(shadows[8]);
    });

    it('draws no shadow for the none size', () => {
      expect(shadowSizes.none).toBe('none');
    });
  });

  describe('SHADOW_COLOR_VAR', () => {
    it('is the palette shadow custom property', () => {
      expect(SHADOW_COLOR_VAR).toBe('--sg-palette-shadow');
    });
  });
});
