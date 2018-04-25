import isPlainObject from 'lodash/isPlainObject';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

/**
 * Checks if an extension locale matches the theme locale.
 * @param {string} themeLocale The locale of the theme.
 * @param {string} extensionLocale The locale of an extension.
 * @return {boolean}
 */
const localesMatch = (themeLocale, extensionLocale) => {
  // Extract the actual locale string from the extension locale.
  const [locale] = extensionLocale.split('/').reverse();
  // Extract the language from the theme locale.
  const [themeLanguage] = themeLocale.split('-');

  /**
   * Theme locales always contain language and region (en-US). But extension locales
   * might only scoped for a language (en). To be sure that all extension translations
   * are considered for the merge, both variants are checked.
   */
  return locale.toLowerCase() === themeLocale.toLowerCase() ||
    locale.toLowerCase() === themeLanguage;
};

/**
 * Merges extension translations into the theme translations.
 * @param {Object} theme The translations object of a theme.
 * @param {Object} extensions The extension translations.
 * @param {string} [locale=process.env.LOCALE_FILE] The current active locale of the theme.
 * @return {Object}
 */
const mergeTranslations = (theme, extensions, locale = process.env.LOCALE_FILE) => {
  if (!isPlainObject(extensions) || Object.keys(extensions).length === 0) {
    // No extension translations provided.
    return cloneDeep(theme);
  }

  return Object.keys(extensions).reduce((result, extensionLocale) => {
    if (!localesMatch(locale, extensionLocale)) {
      // Continue if the current extension locale doesn't match the theme locale.
      return result;
    }

    // Merge the curent extensions into the result.
    return merge(result, extensions[extensionLocale]);
  }, cloneDeep(theme));
};

export default mergeTranslations;
