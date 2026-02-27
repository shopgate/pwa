import merge from 'lodash/merge';
import createBreakpoints from './createBreakpoints';
import createSpacing from './createSpacing';
import transitions from './transitions';
import zIndex from './zIndex';
import createThemeFromColorScheme from './createThemeFromColorScheme';
import createCssVarsForColorSchemeThemes from './createCssVarsForColorSchemeThemes';
import { createGetColorSchemeSelector, createSetActiveColorScheme } from './helpers';

/** @typedef {import('./index').ThemeOptions} ThemeOptions */
/** @typedef {import('./index').BaseTheme} BaseTheme */
/** @typedef {import('./index').DefaultColorScheme} DefaultColorScheme */
/** @typedef {import('./index').ColorSchemeThemes} ColorSchemeThemes */

// eslint-disable-next-line valid-jsdoc
/**
 * Creates a theme object for the ThemeProvider.
 * @param {ThemeOptions} options The theme options.
 * @returns The theme object
 */
export const createTheme = (options = {}) => {
  const {
    defaultColorScheme = 'light',
    colorSchemeSelector = 'data',
    palette: paletteInput = {},
    typography: typographyInput = {},
    colorSchemes = { light: {} },
  } = options;

  const defaultScheme = merge({
    paletteInput,
    typographyInput,
  }, colorSchemes[defaultColorScheme] ?? {});

  /** @type {ColorSchemeThemes} */
  const colorSchemeThemes = Object.entries(colorSchemes).reduce((acc, [type, scheme]) => {
    acc[type] = createThemeFromColorScheme(merge(
      { palette: { mode: type } },
      defaultScheme,
      scheme
    ));
    return acc;
  }, {});

  const getColorSchemeSelector = createGetColorSchemeSelector(colorSchemeSelector);
  const setActiveColorScheme = createSetActiveColorScheme(colorSchemeSelector);

  const cssVars = createCssVarsForColorSchemeThemes(colorSchemeThemes, { getColorSchemeSelector });

  const currentTheme = colorSchemeThemes[defaultColorScheme] ?? colorSchemeThemes.light;

  const breakpoints = createBreakpoints();
  const spacing = createSpacing();

  return {
    ...currentTheme,
    ...cssVars,
    defaultColorScheme,
    breakpoints,
    spacing,
    transitions,
    zIndex,
    getColorSchemeSelector,
    setActiveColorScheme,
  };
};
