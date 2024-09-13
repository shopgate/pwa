import { i18n } from '../../core/helpers/i18n';

/**
 * Translate filter label
 * @param {string} id filter id.
 * @param {string} label filter label.
 * @returns {string}
 */
export function translateFilterLabel(id, label) {
  return i18n.textWithDefault(`filter.label.${id}`, label);
}
