import { useWidgetConfig } from './useWidgetConfig';

/**
 * Retrieves the styles for a specific widget by its ID.
 * @param {string} widgetId The ID of the widget to look for.
 * @returns {Object}
 */
export function useWidgetStyles(widgetId) {
  const { styles = {} } = useWidgetConfig(widgetId);
  return styles;
}
