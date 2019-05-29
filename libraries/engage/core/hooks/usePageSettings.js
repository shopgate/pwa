import { usePageConfig } from './usePageConfig';

/**
 * Retrieves the settings for the current page.
 * @returns {Object}
 */
export function usePageSettings() {
  const { settings = {} } = usePageConfig();

  return settings;
}
