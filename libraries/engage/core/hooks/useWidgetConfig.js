import defaultsDeep from 'lodash/defaultsDeep';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useRoute } from './useRoute';
import { usePageSettings } from './usePageSettings';
import { useSettings } from './useSettings';

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
  const { [widgetId]: pageSettings = {} } = usePageSettings();
  const { [widgetId]: globalSettings = {} } = useSettings();
  const page = pages.find(element => element.pattern === pattern);

  if (!page) {
    return { settings: globalSettings };
  }

  const widget = [].concat(page.widgets).find((element, i) => {
    if (index === undefined) {
      return element.id === widgetId;
    }

    return element.id === widgetId && i === index;
  });

  if (!widget) {
    return { settings: defaultsDeep(pageSettings, globalSettings) };
  }

  const { name, id, ...config } = widget;

  const settings = defaultsDeep(config.settings, pageSettings, globalSettings);

  return {
    ...config,
    settings,
  };
}
