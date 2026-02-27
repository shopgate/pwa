import merge from 'lodash/merge';
import { cssVarsParser } from './helpers';

/** @typedef {import('./index').ColorSchemeThemes} ColorSchemeThemes */
/** @typedef {import('./index').BaseTheme} BaseTheme */
/** @typedef {import('./helpers').GetColorSchemeSelector} GetColorSchemeSelector */
/** @typedef {import('./createCssVarsForColorSchemeThemes')
 * .CreateCssVarsForColorSchemeThemesOptions} CreateCssVarsForColorSchemeThemesOptions */
/** @typedef {import('./createCssVarsForColorSchemeThemes')
 * .CreateCssVarsForColorSchemeThemesReturnValue} CreateCssVarsForColorSchemeThemesReturnValue */

/**
 * Generates CSS variables for each color scheme theme, to be used in the CSS of the application.
 * This allows for dynamic theming based on the active color scheme.
 * @param {ColorSchemeThemes} colorSchemes The default themes by each color scheme.
 * @param {CreateCssVarsForColorSchemeThemesOptions} options Helper Options
 * @returns {CreateCssVarsForColorSchemeThemesReturnValue}
 */
export default function createCssVarsForColorSchemeThemes(colorSchemes, options) {
  const { getColorSchemeSelector } = options || {};

  const colorSchemeMap = [];
  const styleSheets = [];

  // Create CSS variables for each color scheme and generate corresponding style sheets
  Object.entries(colorSchemes).forEach(([schemeName, theme]) => {
    const { css, vars, varsWithDefaults } = cssVarsParser(theme);

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
