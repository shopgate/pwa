import { useRoute } from './useRoute';
import { getWidgetConfig } from '../config/getWidgetConfig';

/**
 * Retrieves the config of a specific widget by its id and an optional index on the current page.
 * If no index is given it will return the first found widget config by widgetId of that page.
 * If no widget is found on the current page or if the page does not exist, an empty object is
 * returned.
 * The returned widget config is pure and the widget settings are not inherited!
 *
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index=0] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetConfig(widgetId, index = 0) {
  const { pattern: pagePattern } = useRoute();
  return getWidgetConfig(pagePattern, widgetId, index);
}
