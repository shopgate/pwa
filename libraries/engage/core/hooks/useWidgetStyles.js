import { useWidgetConfig } from './useWidgetConfig';

/**
 * Retrieves the widget-configuration-styles for a specific widget by its id and an optional index.
 * If no index is given it will return the first found widget-configuration-styles by widgetId.
 * @param {string} widgetId The ID of the widget to look for.
 * @param {number|undefined} [index] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetStyles(widgetId, index) {
  const { styles = {} } = useWidgetConfig(widgetId, index);
  return styles;
}
