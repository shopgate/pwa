
import { type ColorSchemeThemes, type BaseTheme } from './'
import { type GetColorSchemeSelector} from './helpers';

export type CreateCssVarsForColorSchemeThemesOptions = {
  getColorSchemeSelector?: GetColorSchemeSelector;
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
  generateStyleSheets: () => Array<Record<string, any>>;
}

/**
 * Generates CSS variables for each color scheme theme, to be used in the CSS of the application.
 * This allows for dynamic theming based on the active color scheme.
 * @param colorSchemes The default themes by each color scheme.
 * @param options Options for generating CSS variables, such as prefix and skip function.
 */
export default function createCssVarsForColorSchemeThemes(
  colorSchemes: ColorSchemeThemes,
  options?: CreateCssVarsForColorSchemeThemesOptions): CreateCssVarsForColorSchemeThemesReturnValue;
