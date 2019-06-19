import {
  getTranslator,
  getPriceFormatter,
  getDateFormatter,
  getTimeFormatter,
  getNumberFormatter,
} from '@shopgate/pwa-common/helpers/i18n';
import { logger } from '@shopgate/pwa-core/helpers';

/**
 * @typedef {Object} I18nHelpers
 * @property {Function} init - Inits locales.
 * @property {Function} text - Text translator.
 * @property {Function} price - Price translator.
 * @property {Function} date - Date translator.
 * @property {Function} time - Time translator.
 * @property {Function} number - Number translator
 */
/**
 * I18n helpers.
 * @returns {I18nHelpers}
 */
const I18n = () => {
  let didInit = false;
  /**
   * Function that throws when called. Used in a default instance of i18n to notify developer
   * when the module is used without initialization.
   */
  const notReadyCb = () => {
    logger.error('i18n is not yet ready. Please postpone translations until App is bootstrapped.');
  };

  return {
    init({ locales, lang }) {
      if (didInit) {
        logger.warn('Looks like i18n locales are already inited. Changing locales now may lead to inconsistent translations.');
      }
      didInit = true;

      this.text = getTranslator(locales, lang);
      this.price = getPriceFormatter(lang);
      this.date = getDateFormatter(lang);
      this.time = getTimeFormatter(lang);
      this.number = getNumberFormatter(lang);
    },
    text: notReadyCb,
    price: notReadyCb,
    date: notReadyCb,
    time: notReadyCb,
    number: notReadyCb,
  };
};

/**
 *
 * @type {I18nHelpers}
 */
export const i18n = I18n();
