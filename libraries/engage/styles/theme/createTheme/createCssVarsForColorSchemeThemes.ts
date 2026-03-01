import merge from 'lodash/merge';
import { cssVarsParser } from './helpers';
import type { ColorSchemeThemes, BaseTheme, ColorSchemeName } from './types';
import type { GetColorSchemeSelector } from './helpers';

type CreateCssVarsForColorSchemeThemesOptions = {
  getColorSchemeSelector: GetColorSchemeSelector;
}

export type CreateCssVarsForColorSchemeThemesReturnValue = {
  /**
   * A theme object that has the shape of the color schemes, but references CSS variables instead
   * of actual color values.
   */
  cssVarsTheme: BaseTheme;
  /**
   * Generates the style sheets for the color schemes of the theme.
   * @returns An array of style sheet objects. Contains one entry per color scheme plus
   * global styles.
   */
  generateStyleSheets: () => Array<Record<string, unknown>>;
}

/**
 * Generates CSS variables for each color scheme theme, to be used in the CSS of the application.
 * This allows for dynamic theming based on the active color scheme.
 * @param colorSchemes The default themes by each color scheme.
 * @param options Options for generating CSS variables, such as prefix and skip function.
 */
export default function createCssVarsForColorSchemeThemes(
  colorSchemes: ColorSchemeThemes,
  options: CreateCssVarsForColorSchemeThemesOptions
): CreateCssVarsForColorSchemeThemesReturnValue {
  const { getColorSchemeSelector } = options || {};

  const colorSchemeMap: Record<ColorSchemeName, {
    css: Record<string, string | number>;
    vars: BaseTheme;
    varsWithDefaults: Record<string, unknown>;
  }> = {} as Record<ColorSchemeName, {
    css: Record<string, string | number>;
    vars: BaseTheme;
    varsWithDefaults: Record<string, unknown>;
  }>;

  const styleSheets: Array<Record<string, unknown>> = [];

  // Create CSS variables for each color scheme and generate corresponding style sheets
  // @ts-expect-error - Sure about the type here
  Object.keys(colorSchemes).forEach((schemeName: ColorSchemeName) => {
    const theme = colorSchemes[schemeName];

    // @ts-expect-error - Sure about the type here
    const { css, vars, varsWithDefaults } = cssVarsParser<BaseTheme>(theme);

    colorSchemeMap[schemeName] = {
      css,
      vars,
      varsWithDefaults,
    };

    styleSheets.push({
      [`${schemeName === 'light' ? ':root, ' : ''}${getColorSchemeSelector(schemeName)}`]: {
        ...css,
      },
    });
  });

  return {
    cssVarsTheme: merge(colorSchemes.light, colorSchemeMap.light.vars),
    generateStyleSheets: () => styleSheets,
  };
}
