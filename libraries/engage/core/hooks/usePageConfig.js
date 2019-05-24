import defaultsDeep from 'lodash/defaultsDeep';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useRoute } from './useRoute';
import { useSettings } from './useSettings';

/**
 * Retrieves the configuration for the current page, optionally limited to a widget id.
 * Widget based settings inherit locally missing settings from the parent's scope.
 * Requesting page-wide configs by widget id saves memory and improves performance.
 * @param {string} [widgetId] The id of the widget to filter by
 * @returns {Object}
 */
export function usePageConfig(widgetId = '') {
  const route = useRoute();
  const { pages } = themeConfig;
  const page = pages.find(element => element.pattern === route.pattern);

  // Include parent settings scope when requesting settings by widget id.
  const { [widgetId]: globalSettings = {} } = (widgetId ? useSettings() : {});

  // Extensions can always add custom routes, and usually don't exist in the theme config
  // This is expected and not an error scenario (therefore no error logging here)
  if (!page) {
    if (widgetId) {
      // Take inherited widget based settings from global scope only when the page doesn't exist
      return { settings: globalSettings };
    }

    // No page specific config data available here
    return {};
  }

  const {
    name, id, pattern, ...config
  } = page;

  if (widgetId) {
    // Merge inherited widget based settings from global and page scope
    return {
      ...config,
      settings: defaultsDeep(config.settings, globalSettings),
    };
  }

  // Do not inherit global non-widget based settings, when asked for a simple page config
  return config;
}
