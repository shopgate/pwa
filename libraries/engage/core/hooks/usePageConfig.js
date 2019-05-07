import { useContext } from 'react';
import { logger } from '@shopgate/pwa-core';
import { ConfigContext } from '../config/ConfigContext';
import { useRoute } from './useRoute';

/**
 * Retrieves the configuration for the current page.
 * @returns {Object}
 */
export function usePageConfig() {
  const { pattern } = useRoute();
  const { pages } = useContext(ConfigContext);
  const page = pages.find(element => element.pattern === pattern);

  if (!page) {
    logger.error(`A page config could not be found for: ${pattern}`);
    return {};
  }

  const { name, id, ...config } = page;

  return config;
}
