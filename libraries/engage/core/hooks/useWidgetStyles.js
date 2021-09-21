import defaultsDeep from 'lodash/defaultsDeep';
import { useWidgetConfig } from './useWidgetConfig';
import { getThemeStyles } from '../config/getThemeStyles';

/**
 * Retrieves the styles for a specific widget by its id. Returns an empty object when no styles
 * exist.
 *
 * @param {string} widgetId The ID of the widget to look for.
 * @param {number|undefined} [index=0] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetStyles(widgetId, index = 0) {
  const { styles = {} } = useWidgetConfig(widgetId, index);

  const globalStyles = getThemeStyles(widgetId);
  return defaultsDeep(styles, globalStyles);
}
