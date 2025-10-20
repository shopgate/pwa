import {
  DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
  DEVELOPMENT_TOOLS_TOGGLE_CMS2_PREVIEW,
} from '../constants';

/**
 * Toggles the simulation of iOS safe area insets.
 * @param {boolean} visible Whether the insets should be visible or not.
 * @returns {Object} The action object.
 */
export const toggleInsets = (visible = true) => ({
  type: DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  visible,
});

/**
 * Toggles the highlighting of the simulated iOS safe area insets.
 * @param {boolean} visible Whether the insets should be visible or not.
 * @returns {Object} The action object.
 */
export const toggleInsetHighlight = (visible = true) => ({
  type: DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
  visible,
});

/**
 * Toggles the CMS 2.0 preview mode.
 * @param {boolean} enabled Whether the CMS 2.0 preview should be enabled or not.
 * @returns {Object} The action object.
 */
export const toggleCms2Preview = (enabled = true) => ({
  type: DEVELOPMENT_TOOLS_TOGGLE_CMS2_PREVIEW,
  enabled,
});
