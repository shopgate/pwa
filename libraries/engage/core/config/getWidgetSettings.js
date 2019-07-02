import defaultsDeep from 'lodash/defaultsDeep';
import { getPageSettings } from './getPageSettings';
import { getWidgetConfig } from './getWidgetConfig';

/**
 * Retrieves the settings of a specific widget by its id and an optional index on the given page.
 * If no index is given it will return the first found widget settings by widgetId on that page.
 * Widget settings that are not defined in the widget settings directly, are inherited from page
 * and theme settings in the upper hierarchy of the config, scoped by the widgetId as key.
 * Settings containing arrays will not be deeply inherited.
 * If no widget is not found on the given page or at the given index, or no settings exist for the
 * given widget id/index combination, then the result will always be an empty object.
 *
 * @param {string} pagePattern The pattern of the page where the widget is located.
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index=0] The optional index of the widget.
 * @returns {Object}
 */
export function getWidgetSettings(pagePattern, widgetId, index = 0) {
  // Use widget id as key to filter by in page settings
  const inheritedPageSettings = getPageSettings(pagePattern, widgetId);
  const { settings: localWidgetSettings = {} } = getWidgetConfig(pagePattern, widgetId, index);

  // Trying to inherit settings from page scope by key can result in an undefined value, because
  // the given keys are not always present.
  if (inheritedPageSettings === undefined) {
    return localWidgetSettings;
  }

  return defaultsDeep(localWidgetSettings, inheritedPageSettings);
}
