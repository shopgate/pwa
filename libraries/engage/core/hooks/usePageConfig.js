import { useContext } from 'react';
import { logger } from '@shopgate/pwa-core';
import defaultsDeep from 'lodash/defaultsDeep';
import { ConfigContext } from '../config/ConfigContext';
import { useRoute } from './useRoute';
import { useSettings } from './useSettings';

/**
 * Retrieves the configuration for the current page.
 * @returns {Object}
 */
export function usePageConfig() {
  const route = useRoute();
  const { pages } = useContext(ConfigContext);
  const globalSettings = useSettings();
  const page = pages.find(element => element.pattern === route.pattern);

  if (!page) {
    logger.error(`No page config found for page pattern "${route.pattern}"`);
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
