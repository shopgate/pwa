import {
  TOGGLE_NAVIGATOR,
  TOGGLE_NAVIGATOR_CART,
  TOGGLE_NAVIGATOR_SEARCH,
  TOGGLE_NAVIGATOR_TITLE,
  TOGGLE_PROGRESSBAR,
  SET_NAVIGATOR_BACKGROUND,
  SET_NAVIGATOR_COLOR,
} from '../constants';

/**
 * Toggles the navigator.
 * @param {boolean} visible The next state of the navigator.
 * @returns {Object} The action object.
 */
export const toggleNavigator = visible => ({
  type: TOGGLE_NAVIGATOR,
  visible,
});

/**
 * Toggles the navigator cart icon.
 * @param {boolean} visible The next state of the cart icon.
 * @returns {Object} The action object.
 */
export const toggleNavigatorCart = visible => ({
  type: TOGGLE_NAVIGATOR_CART,
  visible,
});

/**
 * Toggles the navigator search.
 * @param {boolean} visible The next state of the search.
 * @returns {Object} The action object.
 */
export const toggleNavigatorSearch = visible => ({
  type: TOGGLE_NAVIGATOR_SEARCH,
  visible,
});

/**
 * Toggles the navigator title.
 * @param {boolean} visible The next state of the title.
 * @returns {Object} The action object.
 */
export const toggleNavigatorTitle = visible => ({
  type: TOGGLE_NAVIGATOR_TITLE,
  visible,
});

/**
 * Toggles the navigator progress bar.
 * @param {boolean} visible The next state of the progress bar.
 * @returns {Object} The action object.
 */
export const toggleProgressBar = visible => ({
  type: TOGGLE_PROGRESSBAR,
  visible,
});

/**
 * Sets the background color of the navigator.
 * @param {boolean} color The next background color.
 * @returns {Object} The action object.
 */
export const setNavigatorBackgroundColor = color => ({
  type: SET_NAVIGATOR_BACKGROUND,
  color,
});

/**
 * Sets the text color of the navigator.
 * @param {string} color The nexttext color.
 * @returns {Object} The action object.
 */
export const setNavigatorTextColor = color => ({
  type: SET_NAVIGATOR_COLOR,
  color,
});
