import defaultsDeep from 'lodash/defaultsDeep';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useRoute } from './useRoute';
import { usePageSettings } from './usePageSettings';

/**
 * Retrieves the widget-configuration for a specific widget by its ID and an optional index.
 * If no index is given it will return the first found widget-configuration by widgetId.
 *
 * @param {string} widgetId The id of the widget to look for, which must exist in the config.
 * @param {number|undefined} [index] The optional index of the widget.
 * @returns {Object}
 */
export function useWidgetConfig(widgetId, index) {
  const { pattern } = useRoute();
  const { pages } = themeConfig;

  // Get widget based page and global settings for the given widget id
  const { [widgetId]: pageSettings = {} } = usePageSettings(widgetId);

  // Get page where the widget is expected to be placed in, if at all
  const page = [].concat(pages).find(element => element.pattern === pattern);
  if (!page) {
    // Page settings always fall back to widget based global settings for the given widgetId
    return { settings: pageSettings };
  }

  // Get the widget on the found page if it is configured there
  const widget = [].concat(page.widgets).find((element, i) => {
    if (index === undefined) {
      return element.id === widgetId;
    }

    return element.id === widgetId && i === index;
  });

  if (!widget) {
    // Fall back to page and global settings, because the widget has no own config
    return { settings: pageSettings };
  }

  const { name, id, ...config } = widget;

  // Fill up global and page settings with local widget settings
  return {
    ...config,
    settings: defaultsDeep(config.settings, pageSettings),
  };
}
