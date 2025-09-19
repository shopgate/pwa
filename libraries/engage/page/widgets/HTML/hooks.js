import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} HtmlWidgetConfig
 * @property {string} [html] - The HTML content to render.
 * @property {string} [internalDescription] - Internal description for the widget.
 */

/**
 * @typedef {Object} UseHtmlWidgetReturnType
 * @property {string} [html] - The HTML content to render.
 * @property {string} [internalDescription] - Internal description for the widget.
 */

/**
 * Hook to access the html widget configuration.
 * @returns {UseHtmlWidgetReturnType} the html widget configuration
 */
export const useHtmlWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const { html } = config;

  return { html };
};
