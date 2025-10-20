import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} PlaceholderWidgetConfig
 * @property {string} foo Example property for the widget configuration.
 * @property {number} bar Another example property for the widget configuration.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 * .useWidget<PlaceholderWidgetConfig> >} HookReturnType
 */

/**
 * Local example hook to demonstrate how to extend the useWidget hook with a custom type for
 * the widget configuration.
 * @returns {HookReturnType}
 */
export const usePlaceholderWidget = () => useWidget();
