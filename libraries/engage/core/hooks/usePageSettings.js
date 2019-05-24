import { usePageConfig } from './usePageConfig';

/**
 * Retrieves the settings for the current page, optionally only for a specific widget.
 * @param {string} [widgetId] The id of the widget to filter by
 * @returns {Object}
 */
export function usePageSettings(widgetId) {
  const { settings = {} } = usePageConfig(widgetId);

  return settings;
}
