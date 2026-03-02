import merge from 'lodash/merge';
import createBreakpoints from './createBreakpoints';
import createSpacing from './createSpacing';
import transitions from './transitions';
import zIndex from './zIndex';
import createThemeFromColorScheme from './createThemeFromColorScheme';
import createCssVarsForColorSchemeThemes from './createCssVarsForColorSchemeThemes';
import { createGetColorSchemeSelector, createSetActiveColorScheme } from './helpers';
import {
  type ThemeOptions,
  type BaseTheme,
  type ColorSchemeThemes,
  type ThemeInternal,
} from './types';

export type {
  Theme,
  ThemeInternal,
  ThemeOptions,
  Breakpoint,
  ColorSchemeName,
  ColorSchemeSelectorType,
} from './types';

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
    colorSchemes = { light: {} },
  } = options;

  const defaultScheme: BaseTheme = merge({
    paletteInput,
    typographyInput,
  // @ts-expect-error - Sure about the type here
  }, colorSchemes[defaultColorScheme] ?? {});

  const colorSchemeThemes: ColorSchemeThemes = Object
    .entries(colorSchemes)
    .reduce((acc, [type, scheme]) => {
      // @ts-expect-error - Sure about the type here
      acc[type] = createThemeFromColorScheme(merge(
        { palette: { mode: type } },
        defaultScheme,
        scheme
      ));
      return acc;
    }, {} as ColorSchemeThemes);

  const getColorSchemeSelector = createGetColorSchemeSelector(colorSchemeSelector);
  const setActiveColorScheme = createSetActiveColorScheme(colorSchemeSelector);

  const {
    cssVarsTheme,
    generateStyleSheets,
  } = createCssVarsForColorSchemeThemes(
    colorSchemeThemes,
    {
      getColorSchemeSelector,
      cssVarPrefix,
    }
  );

  const currentTheme = colorSchemeThemes[defaultColorScheme] ?? colorSchemeThemes.light;

  const breakpoints = createBreakpoints();
  const spacing = createSpacing();

  return {
    ...currentTheme,
    ...cssVarsTheme,
    defaultColorScheme,
    breakpoints,
    spacing,
    transitions,
    zIndex,
    getColorSchemeSelector,
    setActiveColorScheme,
    generateStyleSheets,
  };
};
