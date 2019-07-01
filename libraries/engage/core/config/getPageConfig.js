import { getThemeConfig } from './getThemeConfig';

/**
 * This function reads the config of a page, given by its pattern. If no page is found, the result
 * is an empty object.
 *
 * @param {string} pagePattern The page to look for in the theme config
 * @returns {Object}
 */
export function getPageConfig(pagePattern) {
  const { pages } = getThemeConfig();
  const config = pages.find(element => element.pattern === pagePattern);

  if (!config) {
    return {};
  }

  return config;
}
