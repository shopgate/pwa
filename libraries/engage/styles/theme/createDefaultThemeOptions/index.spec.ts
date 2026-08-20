import { createDefaultThemeOptions } from '@shopgate/engage/styles/theme/createDefaultThemeOptions';

describe('engage > styles > theme > createDefaultThemeOptions', () => {
  describe('light color scheme', () => {
    it('should keep deriving its values from the legacy config', () => {
      const { colorSchemes: { light } } = createDefaultThemeOptions();

      // From themeConfig.colors.placeholder rather than the hard coded fallback next to it.
      expect(light.palette.background.emphasized).toBe('#f2f2f2');
      expect(light.palette.text.primary).toBe('#1A1A1A');
      expect(light.palette.text.secondary).toBe('#808080');
      expect(light.components.tabBar.vars.border).toBe('#E6E6E6');
      expect(light.components.snackbar.vars.background).toBe('#323232');
    });

    it('should not carry any of the color scheme specific dark values', () => {
      const { colorSchemes: { light } } = createDefaultThemeOptions();

      expect(light.palette.background.default).not.toBe('#000000');
      expect(light.palette.background.surface).not.toBe('#1C1C1E');
      expect(light.components.appBar.vars.background).not.toBe('#1C1C1E');
    });
  });

  describe('dark color scheme', () => {
    it('should provide its own surfaces and text colors', () => {
      const { colorSchemes: { dark } } = createDefaultThemeOptions();

      expect(dark.palette.background).toEqual({
        default: '#000000',
        surface: '#1C1C1E',
        emphasized: '#2C2C2E',
      });
      expect(dark.palette.text).toEqual({
        primary: '#F2F2F7',
        secondary: '#AEAEB2',
      });
    });

    it('should provide its own status colors', () => {
      const { colorSchemes: { dark } } = createDefaultThemeOptions();

      expect(dark.palette.error.main).toBe('#FF6B6B');
      expect(dark.palette.warning.main).toBe('#FFA726');
      expect(dark.palette.success.main).toBe('#5DD954');
    });

    // The brand colors are the reason the whole scheme is a partial one. Inheriting them keeps a
    // merchant's configured colors in place, so a value here would replace them for every shop.
    it('should not provide brand colors of its own', () => {
      const { colorSchemes: { dark } } = createDefaultThemeOptions();

      expect(dark.palette).not.toHaveProperty('primary');
      expect(dark.palette).not.toHaveProperty('secondary');
      expect(dark.components).not.toHaveProperty('price');
      expect(dark.components).not.toHaveProperty('ctaButton');
      expect(dark.components).not.toHaveProperty('badge');
      expect(dark.components.ratingStars.vars).not.toHaveProperty('filled');
    });

    it('should darken the components that would otherwise inherit a light surface', () => {
      const { colorSchemes: { dark } } = createDefaultThemeOptions();

      expect(dark.components.appBar.vars.background).toBe('#1C1C1E');
      expect(dark.components.tabBar.vars.background).toBe('#1C1C1E');
      expect(dark.components.cards.vars.backgroundColor).toBe('#1C1C1E');
      expect(dark.components.tiles.vars.backgroundColor).toBe('#1C1C1E');
      expect(dark.components.input.vars.background).toBe('#2C2C2E');
      expect(dark.components.snackbar.vars.background).toBe('#2C2C2E');
      expect(dark.components.separatorLine.vars.borderColor).toBe('#38383A');
      expect(dark.components.border.vars).toEqual({
        light: '#38383A',
        medium: '#48484A',
        dark: '#8E8E93',
      });
    });

    it('should not leave the derived contrast colors to the light scheme', () => {
      const { colorSchemes: { dark } } = createDefaultThemeOptions();

      expect(dark.components.appBar.vars).not.toHaveProperty('color');
      expect(dark.palette.error).not.toHaveProperty('contrastText');
    });
  });
});
