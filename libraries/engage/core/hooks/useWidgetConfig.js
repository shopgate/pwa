import { useRoute } from './useRoute';
import { getWidgetConfig } from '../config/getWidgetConfig';

/**
 * Retrieves the pure config for widget by its id and optional index on the current page.
 * See documentation of `getWidgetConfig` for further details.
 *
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index=0] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetConfig(widgetId, index = 0) {
  const { pattern: pagePattern } = useRoute();
  return getWidgetConfig(pagePattern, widgetId, index);
}
