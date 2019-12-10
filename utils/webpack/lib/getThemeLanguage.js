const chalk = require('chalk');
const fs = require('fs');
const logger = require('./logger');
const i18n = require('./i18n');
const convertLanguageToISO = require('./convertLanguageToISO');

const t = i18n(__filename);
const DEFAULT_LANGUAGE = 'en-US';

/**
 * Find all language files of a single theme.
 * @param {string} themePath The path of a theme
 * @return {Array}
 */
function findThemeLanguages(themePath) {
  const localeRegex = /^[a-z]{2}-[a-z]{2}.json/i;
  const localeFolder = `${themePath}/locale`;
  let languages = [];

  if (fs.existsSync(localeFolder)) {
    const files = fs.readdirSync(localeFolder);
    // Collect the languages from the folder
    languages = files.reduce((matches, file) => {
      if (localeRegex.test(file)) {
        matches.push(file.substr(0, file.length - 5));
      }

      return matches;
    }, []);
  }

  return languages;
}

/**
 * Determines a language for a theme. It considers the language files which are located within
 * the locale folder of the theme that is about to be compiled. If a valid language can't be
 * determined, it will fallback to a default one or the first available.
 * @param {string} themePath The path of a theme
 * @param {string} locale A locale which is used to pick a language from the available languages
 * @return {string}
 */
module.exports = function getThemeLanguage(themePath, locale) {
  const availableLanguages = findThemeLanguages(themePath);
  let language;

  const needle = convertLanguageToISO(locale);
  // Decode the language from the locale string.
  const [localeLang] = needle.split('-');
  // Get the first language from the list which matches the language section of the locale.
  const languageMatch = availableLanguages.find(entry => entry.startsWith(localeLang));

  if (availableLanguages.includes(needle)) {
    // An exact match was found.
    language = needle;
  } else if (languageMatch) {
    // An equal language to the desired locale was found.
    language = languageMatch;
  } else if (availableLanguages.includes(DEFAULT_LANGUAGE)) {
    // Nothing was found, so the default language will be used.
    language = DEFAULT_LANGUAGE;
  } else {
    // Add the first language if the previous checks where not successful.
    [language] = availableLanguages;
  }

  logger.log(`  ${t('THEME_LANGUAGE_SET_TO', {
    fileLocale: chalk.bold.green(language),
    guruLocale: chalk.bold.blue(needle),
  })}`);

  return language;
};
