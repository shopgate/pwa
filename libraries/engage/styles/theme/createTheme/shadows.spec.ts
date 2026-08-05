import shadows, { createShadowForSize } from './shadows';

describe('styles / theme / createTheme / shadows', () => {
  describe('createShadowForSize()', () => {
    it('draws no shadow for the none size', () => {
      expect(createShadowForSize('none', '#ff00ff')).toBe('none');
    });

    it('bakes the configured color into every layer', () => {
      const shadow = createShadowForSize('medium', '#ff00ff');

      // The color has to sit in the declaration itself. Recoloring the theme scale through a
      // custom property does not work: its entries are resolved on `:root`, so a per-surface
      // color would never reach them.
      expect(shadow.match(/rgba\(255,0,255,/g)).toHaveLength(3);
      expect(shadow).not.toContain('var(');
    });

    it('keeps the layer opacities fixed across colors and sizes', () => {
      const alphas = (shadow: string) => shadow.split('rgba(').slice(1)
        .map(layer => layer.slice(0, layer.indexOf(')')).split(',')[3]);

      expect(alphas(createShadowForSize('low', '#ff00ff'))).toEqual(['0.2', '0.14', '0.12']);
      expect(alphas(createShadowForSize('strong', '#123456'))).toEqual(['0.2', '0.14', '0.12']);
    });

    it('uses a different geometry per size', () => {
      const geometry = (size: 'low' | 'medium' | 'strong') =>
        createShadowForSize(size, '#000000').split('rgba(0,0,0,').join('');

      expect(new Set([geometry('low'), geometry('medium'), geometry('strong')]).size).toBe(3);
    });

    it('falls back to the default color for an empty color', () => {
      expect(createShadowForSize('low', '')).toContain('rgba(0,0,0,');
    });

    it('draws hex colors as plain rgba', () => {
      // Plain `rgba` rather than `color-mix`, which is not supported across the whole
      // browserslist range - and an unsupported value invalidates the whole declaration.
      expect(createShadowForSize('low', '#ff00ff')).toContain('rgba(255,0,255,0.2)');
      expect(createShadowForSize('low', '#f0f')).toContain('rgba(255,0,255,0.2)');
      expect(createShadowForSize('low', ' #ff00ff ')).toContain('rgba(255,0,255,0.2)');
    });

    it('falls back to color-mix for a color that is not hex', () => {
      expect(createShadowForSize('low', 'hotpink'))
        .toContain('color-mix(in srgb, hotpink 20%, transparent)');
      expect(createShadowForSize('low', 'rgba(255, 0, 255, 0.5)'))
        .toContain('color-mix(in srgb, rgba(255, 0, 255, 0.5) 20%, transparent)');
    });

    it('rejects a malformed hex color rather than rendering it as NaN', () => {
      expect(createShadowForSize('low', '#gggggg')).not.toContain('NaN');
      expect(createShadowForSize('low', '#ff00f')).not.toContain('NaN');
    });

    it('matches the theme scale entry it maps to', () => {
      // `medium` maps to elevation 4, and in the default color both render the very same layers.
      expect(createShadowForSize('medium', '#000000')).toBe(shadows[4]);
      expect(shadows[4]).toContain('rgba(0,0,0,0.14)');
    });
  });

  describe('shadows', () => {
    it('exposes 25 elevations starting with none', () => {
      expect(shadows).toHaveLength(25);
      expect(shadows[0]).toBe('none');
    });
  });
});
