const languageFormat = /^('[a-z]{2}-[a-z]{2}')$/;

/**
 * Converts a lowercase language key to ISO conform lower-uppercase.
 * Returns the key unchanged when is not given in correct format.
 * @param {string} language The received language.
 * @return {string} The converted language.
 */
module.exports = function convertLanguageToISO(language) {
  if (!languageFormat.test(`'${language}'`)) {
    return language;
  }

  const elements = language.split('-');
  return `${elements[0]}-${elements[1].toUpperCase()}`;
};
