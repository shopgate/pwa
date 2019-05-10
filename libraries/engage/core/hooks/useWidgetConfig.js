import { logger } from '@shopgate/pwa-core';
import defaultsDeep from 'lodash/defaultsDeep';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useRoute } from './useRoute';
import { usePageSettings } from './usePageSettings';
import { useSettings } from './useSettings';

/**
 * Retrieves the configuration for a specific widget by its ID.
 * @param {string} widgetId The ID of the widget to look for.
 * @returns {Object}
 */
export function useWidgetConfig(widgetId) {
  const { pattern } = useRoute();
  const { pages } = themeConfig;
  const { [widgetId]: pageSettings = {} } = usePageSettings();
  const { [widgetId]: globalSettings = {} } = useSettings();
  const page = pages.find(element => element.pattern === pattern);

  if (!page || !page.widgets) {
    logger.error(`A page config could not be found for: ${pattern}`);
    return {};
  }

  const widget = page.widgets.find(element => element.id === widgetId);

  if (!widget) {
    logger.error(`A widget config could not be found for: ${widgetId}`);
    return {};
  }

  const { name, id, ...config } = widget;

  const settings = defaultsDeep(defaultsDeep(config.settings, pageSettings), globalSettings);

  return {
    ...config,
    settings,
  };
}
