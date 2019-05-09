import defaultsDeep from 'lodash/defaultsDeep';
import { usePageConfig } from './usePageConfig';
import { useSettings } from './useSettings';

/**
 * Retrieves the settings for the current page.
 * @returns {Object}
 */
export function usePageSettings() {
  const { settings = {} } = usePageConfig();
  const globalSettings = useSettings();

  return defaultsDeep(settings, globalSettings);
}
