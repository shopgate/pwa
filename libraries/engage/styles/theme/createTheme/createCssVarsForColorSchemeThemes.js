import merge from 'lodash/merge';
import { cssVarsParser } from './helpers';

/** @typedef {import('./index').ColorSchemeThemes} ColorSchemeThemes */
/** @typedef {import('./index').BaseTheme} BaseTheme */
/** @typedef {import('./helpers').GetColorSchemeSelector} GetColorSchemeSelector */

const STYLE_TAG_ID = 'sg-theme-stylesheet';

/**
 * Injects the generated CSS variables into a style tag in the document head.
 * @param {Array} styleSheets An array of style sheet objects containing CSS variable declarations.
 */
const injectStyleSheets = (styleSheets) => {
  let styleTag = document.getElementById(STYLE_TAG_ID);

  if (styleTag) {
    styleTag.remove();
  }

  styleTag = document.createElement('style');
  styleTag.setAttribute('id', STYLE_TAG_ID);

  const cssContent = styleSheets
    .map((sheet) => {
      const selector = Object.keys(sheet)[0];
      const declarations = Object.entries(sheet[selector])
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n');
      return `${selector} {\n${declarations}\n}`;
    })
    .join('\n');

  styleTag.textContent = cssContent;
  document.head.appendChild(styleTag);
};

/**
 * Generates CSS variables for each color scheme theme, to be used in the CSS of the application.
 * This allows for dynamic theming based on the active color scheme.
 * @param {ColorSchemeThemes} colorSchemes The themes for each color scheme.
 * @param {Object} options Options for generating CSS variables, such as prefix and skip function.
 * @param {GetColorSchemeSelector} options.getColorSchemeSelector A function to generate the CSS
 * selector for a given color scheme.
 * @returns {BaseTheme}
 */
const createCssVarsForColorSchemeThemes = (colorSchemes, options) => {
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

  injectStyleSheets(styleSheets);

  return merge(colorSchemes.light, colorSchemeMap.light.vars);
};

export default createCssVarsForColorSchemeThemes;
