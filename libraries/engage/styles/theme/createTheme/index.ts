import merge from 'lodash/merge';
import createBreakpoints from './createBreakpoints';
import createSpacing from './createSpacing';
import transitions from './transitions';
import zIndex from './zIndex';
import layout from './layout';
import createThemeFromColorScheme from './createThemeFromColorScheme';
import createCssVarsForColorSchemeThemes from './createCssVarsForColorSchemeThemes';
import applyStyles from './applyStyles';
import { createGetColorSchemeSelector, createSetActiveColorScheme } from './helpers';
import {
  type ThemeOptions,
  type BaseTheme,
  type ColorSchemeThemes,
  type ThemeInternal,
} from './types';

export type {
  Theme,
  BaseTheme,
  ThemeInternal,
  ThemeOptions,
  Breakpoint,
  ColorSchemeName,
  ColorSchemeSelectorType,
  PaletteColorsWithMain,
} from './types';

export { COLOR_SCHEME_NAMES } from './types';

/**
 * Creates a theme object for the ThemeProvider.
 * @param options The theme options.
 * @returns The theme object
 */
export const createTheme = (options: ThemeOptions = {}): ThemeInternal => {
  const {
    defaultColorScheme = 'light',
    colorSchemeSelector = 'data',
    cssVarPrefix = 'sg',
    palette: paletteInput = {},
    typography: typographyInput = {},
    colorSchemes: colorSchemesInput = { light: {} },
  } = options;

  const defaultScheme: BaseTheme = merge({}, {
    palette: paletteInput,
    typography: typographyInput,
  // @ts-expect-error - Sure about the type here
  }, colorSchemesInput[defaultColorScheme] ?? {});

  const colorSchemes: ColorSchemeThemes = Object
    .entries(colorSchemesInput)
    .reduce((acc, [type, scheme]) => {
      // @ts-expect-error - Sure about the type here
      acc[type] = createThemeFromColorScheme(merge(
        {},
        { palette: { mode: type } },
        defaultScheme,
        scheme
      ), cssVarPrefix);
      return acc;
    }, {} as ColorSchemeThemes);

  const getColorSchemeSelector = createGetColorSchemeSelector(colorSchemeSelector);
  const setActiveColorScheme = createSetActiveColorScheme(colorSchemeSelector);

  const {
    cssVarsTheme,
    generateStyleSheets,
  } = createCssVarsForColorSchemeThemes(
    colorSchemes,
    {
      getColorSchemeSelector,
      cssVarPrefix,
    }
  );

  const currentTheme = colorSchemes[defaultColorScheme] ?? colorSchemes.light;

  const breakpoints = createBreakpoints();
  const spacing = createSpacing();

  const theme = {
    ...currentTheme,
    ...cssVarsTheme,
    defaultColorScheme,
    breakpoints,
    spacing,
    transitions,
    zIndex,
    layout,
    colorSchemes,
    getColorSchemeSelector,
    setActiveColorScheme,
    generateStyleSheets,
  } as ThemeInternal;

  theme.applyStyles = applyStyles;

  return theme;
};
