const path = require('path');
const fsEx = require('fs-extra');
const MessageFormat = require('messageformat');
const Messages = require('messageformat/messages');

const rootDirectory = path.resolve(__dirname, '..');
const localesDirectory = path.resolve(rootDirectory, 'locales');

/**
 * The i18n class.
 */
class I18n {
  /**
   * @param {string} [locale='en'] The desired locale for the module.
   */
  constructor(locale = 'en') {
    const locales = [locale];

    if (!locales.includes('en')) {
      locales.unshift('en');
    }

    const messageSet = {};
    locales.forEach((entry) => {
      const localeFilePath = path.resolve(rootDirectory, localesDirectory, `${entry}.json`);
      messageSet[entry] = fsEx.readJSONSync(localeFilePath);
    });

    const messageFormat = new MessageFormat(locales);
    this.messages = new Messages(messageFormat.compile(messageSet));
    this.messages.locale = locale;
  }

  /**
   * @param {Array} keyPath The key path of the translation.
   * @param {Object} data Additional data for the translation.
   * @returns {string|Array}
   */
  get(keyPath, data = {}) {
    if (this.messages.hasObject(keyPath)) {
      return keyPath;
    }

    return this.messages.get(keyPath, data);
  }
}

let i18n;

module.exports = (modulePath) => {
  if (!i18n) {
    i18n = new I18n('en');
  }

  const moduleNamespace = path.relative(rootDirectory, modulePath).replace(/(^(lib|src)+\/)|(\.js$)/ig, '');

  return (key, data) => {
    const keyPath = [moduleNamespace];

    if (Array.isArray(key)) {
      keyPath.push(...key);
    } else if (typeof key === 'string') {
      keyPath.push(key);
    } else {
      throw new Error(`'${key}' is not a valid message key`);
    }

    const message = i18n.get(keyPath, data);

    if (message === keyPath) {
      return key;
    }

    return message;
  };
};

module.exports.I18n = I18n;
