import {
  DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
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

