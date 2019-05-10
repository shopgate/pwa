import { useWidgetConfig } from './useWidgetConfig';

/**
 * Retrieves the widget-configuration-settings for a specific widget by its id and
 * an optional index.
 * If no index is given it will return the first found widget-configuration-settings by widgetId.
 *
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetSettings(widgetId, index) {
  const { settings = {} } = useWidgetConfig(widgetId, index);
  return settings;
}
