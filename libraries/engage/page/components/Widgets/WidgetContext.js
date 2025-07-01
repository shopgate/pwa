import { createContext } from 'react';

/**
 * @typedef {import('./Widgets.jsx').WidgetDefinition} WidgetDefinition
 */

/**
 * @typedef {Object} WidgetContextType
 * @property {WidgetDefinition['code']} code The unique widget code.
 * @property {WidgetDefinition['widgetConfig']} config The widget configuration.
 * @property {WidgetDefinition['layout']} layout The widget layout settings.
 * @property {WidgetDefinition['visibility']} visibility The widget visibility settings.
 */

/** @type {React.Context<WidgetContextType>} */
export const WidgetContext = createContext({});
