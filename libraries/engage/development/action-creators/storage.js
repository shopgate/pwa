import {
  DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE,
} from '../constants';

/**
 * Updates the status bar style storage where latest payload from the updateNavigationBarStyle
 * app event is stored.
 * @param {boolean} style The event payload
 * @returns {Object} The action object.
 */
export const updateStatusBarStyleStorage = (style = {}) => ({
  type: DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE,
  style,
});

