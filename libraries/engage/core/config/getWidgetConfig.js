import { getPageConfig } from '../config/getPageConfig';

/**
 * Retrieves the config for a specific widget by its id and an optional index on a given page.
 * If no index is given it will return the first found widget config by widgetId of that page.
 * If no widget is found on the current page or if the page does not exist, an empty object is
 * returned.
 * The returned widget config is pure and the widget settings are not inherited!
 *
 * @param {string} pagePattern The pattern of the page where the widget is located.
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index=0] The optional index of the widget.
 * @returns {Object}
 */
export function getWidgetConfig(pagePattern, widgetId, index = 0) {
  const { widgets = [] } = getPageConfig(pagePattern, widgetId);

  const widgetConfig = [].concat(widgets).find((element, i) => {
    if (!index) {
      return element.id === widgetId;
    }

    return element.id === widgetId && i === index;
  });

  if (!widgetConfig) {
    return {};
  }

  return widgetConfig;
}
