import { useContext } from 'react';
import { logger } from '@shopgate/pwa-core';
import defaultsDeep from 'lodash/defaultsDeep';
import { ConfigContext } from '../config/ConfigContext';
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
  const { pages } = useContext(ConfigContext);
  const { [widgetId]: pageSettings = {} } = usePageSettings();
  const { [widgetId]: globalSettings = {} } = useSettings();
  const page = pages.find(element => element.pattern === pattern);

  if (!page) {
    logger.error(`No page config found for page pattern "${pattern}"`);
    return {};
  }

  if (!page.widgets) {
    logger.error(`The page config for page pattern "${pattern}" does not contain any widgets`);
    return {};
  }

  const widget = page.widgets.find((element, i) => {
    if (index === undefined) {
      return element.id === widgetId;
    }

    return element.id === widgetId && i === index;
  });

  if (!widget) {
    if (index === undefined) {
      logger.error(`A widget config could not be found for widget "${widgetId}"`);
    } else {
      logger.error(`A widget config could not be found for widget "${widgetId}" at index ${index}`);
    }

    return {};
  }

  const { name, id, ...config } = widget;

  const settings = defaultsDeep(defaultsDeep(config.settings, pageSettings), globalSettings);

  return {
    ...config,
    settings,
  };
}
