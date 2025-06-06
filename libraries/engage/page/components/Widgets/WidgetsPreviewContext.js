import { createContext } from 'react';
import { noop } from 'lodash';

/**
 * @callback SetActiveWidget
 * @param {string} code The code of the widget to set as active.
 * @param {boolean} [highlight=false] Whether to highlight the widget after setting it as active.
 */

/**
 * @typedef {Object} WidgetsPreviewContextType
 * @property {string} activeWidget The code of the currently active widget.
 * @property {SetActiveSetActiveWidgetCode} setActiveWidget A function to set the active widget code
 */

/** @type {React.Context<WidgetsPreviewContextType>} */
export const WidgetsPreviewContext = createContext({
  activeWidget: null,
  setActiveWidget: noop,
});
