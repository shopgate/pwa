import { createDefaultThemeOptions } from '@shopgate/engage/styles/theme/createDefaultThemeOptions';
import { createTheme } from '@shopgate/engage/styles';

/**
 * A color scheme of the returned options, narrowed for assertions. `ThemeOptions` types these
 * through a `DeepPartial` that TypeScript cannot resolve, leaving every access untyped.
 */
type SchemeOptions = {
  palette: Record<string, Record<string, string>>;
  components: Record<string, { vars: Record<string, string> }>;
};

const colorSchemes = (options?: { isHydrated: boolean }) => createDefaultThemeOptions(options)
  .colorSchemes as unknown as {
    light: SchemeOptions;
    dark: SchemeOptions;
  };

describe('engage > styles > theme > createDefaultThemeOptions', () => {
  describe('light color scheme', () => {
    it('should keep deriving its values from the legacy config', () => {
      const { light } = colorSchemes();

      // From themeConfig.colors.placeholder rather than the hard coded fallback next to it.
      expect(light.palette.background.emphasized).toBe('#f2f2f2');
      expect(light.palette.text.primary).toBe('#1A1A1A');
      expect(light.palette.text.secondary).toBe('#808080');
      expect(light.components.tabBar.vars.border).toBe('#E6E6E6');
      expect(light.components.snackbar.vars.background).toBe('#323232');
    });

    it('should not carry any of the color scheme specific dark values', () => {
      const { light } = colorSchemes();

      expect(light.palette.background.default).not.toBe('#000000');
      expect(light.palette.background.surface).not.toBe('#1C1C1E');
      expect(light.components.appBar.vars.background).not.toBe('#1C1C1E');
    });
  });

  describe('cta button', () => {
    // The app settings own the color once they carry one. Seeding the legacy custom properties
    // here would keep overriding what they hydrate.
    it('should seed the legacy cta color while the app settings are unhydrated', () => {
      const { light } = colorSchemes();

      expect(light.components).toHaveProperty('ctaButton');
    });

    it('should leave the cta color to the app settings once they are hydrated', () => {
      const { light } = colorSchemes({ isHydrated: true });

      expect(light.components).not.toHaveProperty('ctaButton');
    });
  });

  describe('dark color scheme', () => {
    it('should provide its own surfaces and text colors', () => {
      const { dark } = colorSchemes();

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

    // Interaction states fall back to the light schema defaults when the scheme omits them, which
    // would paint a near white press highlight onto the dark surfaces.
    it('should provide its own interaction state colors', () => {
      const { dark } = colorSchemes();

      expect(dark.palette.action).toEqual({
        disabled: '#8E8E93',
        disabledBackground: '#48484A',
        pressed: '#2C2C2E',
      });
    });

    it('should provide its own status colors', () => {
      const { dark } = colorSchemes();

      expect(dark.palette.error.main).toBe('#FF6B6B');
      expect(dark.palette.warning.main).toBe('#FFA726');
      expect(dark.palette.success.main).toBe('#5DD954');
    });

    // The brand colors are the reason the whole scheme is a partial one. Inheriting them keeps a
    // merchant's configured colors in place, so a value here would replace them for every shop.
    it('should not provide brand colors of its own', () => {
      const { dark } = colorSchemes();

      expect(dark.palette).not.toHaveProperty('primary');
      expect(dark.palette).not.toHaveProperty('secondary');
      expect(dark.components).not.toHaveProperty('price');
      expect(dark.components).not.toHaveProperty('ctaButton');
      expect(dark.components).not.toHaveProperty('badge');
      expect(dark.components.ratingStars.vars).not.toHaveProperty('filled');
    });

    it('should darken the components that would otherwise inherit a light surface', () => {
      const { dark } = colorSchemes();

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

    it('should give every swiper variable a dark counterpart', () => {
      const { light, dark } = colorSchemes();

      expect(Object.keys(dark.components.swiper.vars).sort())
        .toEqual(Object.keys(light.components.swiper.vars).sort());
    });

    it('should not read the legacy light only css custom properties', () => {
      const { dark } = colorSchemes();

      const values = Object.values(dark.components)
        .flatMap(component => Object.values(component.vars));

      expect(values).not.toHaveLength(0);
      values.forEach((value) => {
        expect(value).not.toContain('var(--');
      });
    });

    it('should not leave the derived contrast colors to the light scheme', () => {
      const { dark } = colorSchemes();

      expect(dark.components.appBar.vars).not.toHaveProperty('color');
      expect(dark.palette.error).not.toHaveProperty('contrastText');
    });
  });

  describe('resolved theme', () => {
    // What the product header cta row overrides for its subtree, and what a merchant overrides
    // from the theme css file.
    it('should expose the new component tokens as css variable references', () => {
      const theme = createTheme(createDefaultThemeOptions());

      expect(theme.components.iconButton.boxShadow)
        .toBe('var(--sg-components-iconButton-boxShadow)');
      expect(theme.components.iconButton.background)
        .toBe('var(--sg-components-iconButton-background)');
      expect(theme.components.iconButton.borderRadius)
        .toBe('var(--sg-components-iconButton-borderRadius)');
    });
  });
});
