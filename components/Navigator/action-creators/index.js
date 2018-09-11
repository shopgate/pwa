import {
  TOGGLE_NAVIGATOR_CART_ICON,
  TOGGLE_NAVIGATOR_SEARCH,
  TOGGLE_PROGRESS_BAR,
  SET_NAVIGATOR_BACKGROUND,
  SET_NAVIGATOR_COLOR,
  SET_ICON_SHADOW_ENABLED,
  SET_ICON_SHADOW_DISABLED,
  SET_SEARCH_ENABLED,
  SET_SEARCH_DISABLED,
  SET_TITLE_ENABLED,
  SET_TITLE_DISABLED,
  SET_NAVIGATOR_ENABLED,
  SET_NAVIGATOR_DISABLED,
} from '../constants';

/**
 * Toggles the navigator progress bar..
 * @param {boolean} active The state of the progress bar.
 * @returns {Object} The action object.
 */
export const toggleProgressBar = active => ({
  type: TOGGLE_PROGRESS_BAR,
  active,
});

/**
 * Toggles the navigator cart icon.
 * @param {boolean} active The cart icon active state.
 * @returns {Object} The action object.
 */
export const toggleCartIcon = active => ({
  type: TOGGLE_NAVIGATOR_CART_ICON,
  active,
});

/**
 * Toggles the navigator search.
 * @param {boolean} active The search active state.
 * @returns {Object} The action object.
 */
export const toggleSearch = active => ({
  type: TOGGLE_NAVIGATOR_SEARCH,
  active,
});

/**
 * Sets the background color of the navigator.
 * @param {boolean} color The navigator's new background color.
 * @returns {Object} The action object.
 */
export const setBackgroundColor = color => ({
  type: SET_NAVIGATOR_BACKGROUND,
  color,
});

/**
 * Sets the text color of the navigator.
 * @param {string} color The navigator's new text color.
 * @returns {Object} The action object.
 */
export const setTextColor = color => ({
  type: SET_NAVIGATOR_COLOR,
  color,
});

/**
 * Enables the navigators icon shadows.
 * @returns {Object} The action object.
 */
export const enableIconShadow = () => ({
  type: SET_ICON_SHADOW_ENABLED,
});

/**
 * Disables the navigators icon shadows.
 * @returns {Object} The action object.
 */
export const disableIconShadow = () => ({
  type: SET_ICON_SHADOW_DISABLED,
});

/**
 * Enables the navigator search.
 * @returns {Object} The action object.
 */
export const enableSearch = () => ({
  type: SET_SEARCH_ENABLED,
});

/**
 * Disables the navigator search.
 * @returns {Object} The action object.
 */
export const disableSearch = () => ({
  type: SET_SEARCH_DISABLED,
});

/**
 * Enables the navigator title.
 * @returns {Object} The action object.
 */
export const enableTitle = () => ({
  type: SET_TITLE_ENABLED,
});

/**
 * Disables the navigator title
 * @returns {Object} The action object.
 */
export const disableTitle = () => ({
  type: SET_TITLE_DISABLED,
});

/**
 * Creates the SET_NAVIGATOR_ENABLED redux action object.
 * @returns {Object} The action object.
 */
export const enable = () => ({
  type: SET_NAVIGATOR_ENABLED,
});

/**
 * Creates the SET_NAVIGATOR_DISABLED redux action object.
 * @returns {Object} The action object.
 */
export const disable = () => ({
  type: SET_NAVIGATOR_DISABLED,
});
