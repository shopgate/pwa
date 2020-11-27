import { i18n } from '../../core/helpers/i18n';

/**
 * Translate filter label
 * @param {Object} id filter id.
 * @param {Object} label filter label.
 * @returns {Object}
 */
export function translateFilterLabel(id, label) {
  return i18n.textWithDefault(`filter.label.${id}`, label);
}
