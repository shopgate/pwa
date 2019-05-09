import { useWidgetConfig } from './useWidgetConfig';

/**
 * Retrieves the configuration for a specific widget by its ID.
 * @param {string} widgetId The ID of the widget to look for.
 * @returns {Object}
 */
export function useWidgetSettings(widgetId) {
  const { settings = {} } = useWidgetConfig(widgetId);
  return settings;
}
