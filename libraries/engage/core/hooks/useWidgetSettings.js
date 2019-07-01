import { useRoute } from './useRoute';
import { getWidgetSettings } from '../config/getWidgetSettings';

/**
 * Retrieves the settings of a specific widget by its id and an optional index on the current page.
 * If no index is given it will return the first found widget settings by widgetId on that page.
 * Widget settings that are not defined in the widget settings directly, are inherited from page
 * and theme settings in the upper hierarchy of the config, scoped by the widgetId as key.
 *
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index=0] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetSettings(widgetId, index = 0) {
  const { pattern: pagePattern } = useRoute();
  return getWidgetSettings(pagePattern, widgetId, index);
}
