const path = require('path');
const fs = require('fs');

const rootDirectory = path.resolve(__dirname, '..');
const localesDirectory = path.resolve(rootDirectory, 'locales');

/**
 * Reads and parses a JSON file with friendly error handling.
 *
 * @private
 * @param {string} file - Absolute path to the JSON file.
 * @returns {Object} Parsed JSON object.
 * @throws {Error} When the file cannot be read or parsed.
 */
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to read locale file "${file}": ${err.message}`);
  }
}

/**
 * Flattens nested objects to dot-separated key paths.
 *
 * Example:
 * ```js
 * flatten({ a: { b: 'c' } }) // -> { 'a.b': 'c' }
 * ```
 *
 * @private
 * @param {Object} obj - The source object.
 * @param {string} [prefix=''] - The prefix for the keys (used for recursion).
 * @param {Object} [out={}] - The accumulator for flattened entries.
 * @returns {Object} A flattened key-value map.
 */
function flatten(obj, prefix = '', out = {}) {
  const result = out;

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, fullKey, result);
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

/**
 * Replaces placeholders of the form `{var}` in a message string.
 *
 * Example:
 * ```js
 * format("Hello {name}", { name: "World" }); // -> "Hello World"
 * ```
 *
 * @private
 * @param {string} template - Message string with `{var}` placeholders.
 * @param {Record<string, string|number>} [values={}] - Replacement values.
 * @returns {string} Formatted string.
 */
function format(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    (values[k] != null ? String(values[k]) : `{${k}}`));
}

/**
 * Provides localized message lookup and interpolation for a given locale.
 *
 * @class
 */
class I18n {
  /**
   * Creates a new I18n instance.
   *
   * @param {string} [locale='en'] - The locale to load (e.g. "en", "de").
   */
  constructor(locale = 'en') {
    const locales = [locale];
    if (!locales.includes('en')) locales.unshift('en');

    let merged = {};
    locales.forEach((entry) => {
      const localeFilePath = path.join(localesDirectory, `${entry}.json`);
      if (fs.existsSync(localeFilePath)) {
        const data = flatten(readJSON(localeFilePath));
        merged = {
          ...merged,
          ...data,
        };
      }
    });

    /**
     * The flattened dictionary of messages for this locale.
     * @type {Record<string, string>}
     */
    this.messages = merged;

    /**
     * The current locale string.
     * @type {string}
     */
    this.locale = locale;
  }

  /**
   * Returns the translated message for the given key path.
   *
   * @param {string[]|string} keyPath - Key path or array of keys representing the translation key.
   * @param {Record<string, string|number>} [data={}] - Optional interpolation data.
   * @returns {string} The translated and formatted message, or the key if not found.
   */
  get(keyPath, data = {}) {
    const id = Array.isArray(keyPath) ? keyPath.join('.') : keyPath;
    const message = this.messages[id];
    if (message == null) {
      return Array.isArray(keyPath) ? keyPath[keyPath.length - 1] : keyPath;
    }
    return format(message, data);
  }
}

let i18n;

/**
 * @typedef {function(key: string|string[], data?: Object): string} TranslatorFn
 */

/**
 * Initializes or retrieves the singleton I18n instance and
 * returns a translation function scoped to the given module.
 *
 * This function automatically derives the message namespace from the
 * relative module path, so keys can be referenced without repeating the prefix.
 *
 * Example:
 * ```js
 * const i18n = require('./lib/i18n');
 * const t = i18n(__filename);
 * console.log(t('HELLO', { name: 'World' }));
 * ```
 *
 * @param {string} modulePath - Absolute path to the module requesting translations
 *   (usually `__filename`).
 * @returns {TranslatorFn} Translator function.
 */
module.exports = (modulePath) => {
  if (!i18n) {
    i18n = new I18n('en');
  }

  const moduleNamespace = path
    .relative(rootDirectory, modulePath)
    .replace(/(^(lib|src)+[/\\])|(\.js$)/ig, '')
    .split(path.sep)
    .join('/');

  return (key, data) => {
    const keyPath = [moduleNamespace];

    if (Array.isArray(key)) {
      keyPath.push(...key);
    } else if (typeof key === 'string') {
      keyPath.push(key);
    } else {
      throw new Error(`'${key}' is not a valid message key`);
    }

    return i18n.get(keyPath, data);
  };
};

/**
 * Exposes the I18n class for testing or advanced usage.
 * @type {typeof I18n}
 */
module.exports.I18n = I18n;
