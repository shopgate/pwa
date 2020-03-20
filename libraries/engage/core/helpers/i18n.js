import get from 'lodash/get';
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
 * @property {Function} getSupplementalData - Get Supplemental Data
 * @property {Function} getPath - Get locale data by path
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
    init({ locales, lang, currencyLocale = null }) {
      if (didInit) {
        logger.warn('Looks like i18n locales are already inited. Changing locales now may lead to inconsistent translations.');
      }
      didInit = true;

      this.text = getTranslator(locales, lang);
      this.price = getPriceFormatter(currencyLocale || lang);
      this.date = getDateFormatter(lang);
      this.time = getTimeFormatter(lang);
      this.number = getNumberFormatter(lang);
      this.getSupplementalData = () => locales.supplementalData || {};
      this.getPath = path => get(locales, path);
      // If component decides to act accordingly this information should be exposed.
      this.ready = true;
    },
    text: notReadyCb,
    price: notReadyCb,
    date: notReadyCb,
    time: notReadyCb,
    number: notReadyCb,
    getSupplementalData: notReadyCb,
    getPath: notReadyCb,
    ready: false,
  };
};

/**
 * @type {I18nHelpers}
 */
export const i18n = I18n();

/**
 * Return order of week days, based on firstDay of week locale settings
 * @returns {string[]}
 */
export const getWeekDaysOrder = () => {
  const { weekData: { firstDay = 'sun' } = {} } = i18n.getSupplementalData();
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayIndex = days.findIndex(d => d === firstDay);

  return days.slice(dayIndex).concat(days.slice(0, dayIndex));
};
