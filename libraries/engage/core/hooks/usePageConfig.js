import { logger } from '@shopgate/pwa-core';
import defaultsDeep from 'lodash/defaultsDeep';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useRoute } from './useRoute';
import { useSettings } from './useSettings';

/**
 * Retrieves the configuration for the current page.
 * @returns {Object}
 */
export function usePageConfig() {
  const route = useRoute();
  const { pages } = themeConfig;
  const globalSettings = useSettings();
  const page = pages.find(element => element.pattern === route.pattern);

  if (!page) {
    logger.error(`A page config could not be found for: ${route.pattern}`);
    return {};
  }

  const {
    name, id, pattern, ...config
  } = page;

  const settings = defaultsDeep(config.settings, globalSettings);

  return {
    ...config,
    settings,
  };
}
