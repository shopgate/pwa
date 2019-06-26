import { useWidgetConfig } from './useWidgetConfig';

/**
 * Retrieves the styles for a specific widget by its ID.
 * @param {string} widgetId The ID of the widget to look for.
 * @param {number|undefined} [index] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetStyles(widgetId, index) {
  const { styles = {} } = useWidgetConfig(widgetId, index);
  return styles;
}
