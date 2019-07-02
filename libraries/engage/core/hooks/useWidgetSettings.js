import { useRoute } from './useRoute';
import { getWidgetSettings } from '../config/getWidgetSettings';

/**
 * Retrieves inherited settings for a widget given by its id and optional index on the current page.
 * See documentation of `getWidgetSettings` for further details.
 *
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index=0] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetSettings(widgetId, index = 0) {
  const { pattern: pagePattern } = useRoute();
  return getWidgetSettings(pagePattern, widgetId, index);
}
