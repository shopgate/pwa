import { createContext } from 'react';
import { noop } from 'lodash';

/**
 * @callback SetActiveId
 * @param {string} id The ID of the widget to set as active.
 * @param {boolean} [highlight=false] Whether to highlight the widget after setting it as active.
 */

/**
 * @typedef {Object} WidgetsPreviewContextType
 * @property {string} activeId The ID of the currently active widget.
 * @property {SetActiveId} setActiveId A function to set the active widget ID.
 */

/** @type {React.Context<WidgetsPreviewContextType>} */
export const WidgetsPreviewContext = createContext({
  activeId: null,
  setActiveId: noop,
});
