import {
  A11Y_INCREASE_MODAL_COUNT,
  A11Y_DECREASE_MODAL_COUNT,
} from '../constants';

/**
 * Increases the modal count inside the A11Y state. Used to determine if parts of the app needs to
 * be hidden for screen readers to improve accessibility.
 * @returns {Object} The Redux action object
 */
export const increaseModalCount = () => ({
  type: A11Y_INCREASE_MODAL_COUNT,
});

/**
 * Decreases the modal count inside the A11Y state. Used to determine if parts of the app needs to
 * be hidden for screen readers to improve accessibility.
 * @returns {Object} The Redux action object
 */
export const decreaseModalCount = () => ({
  type: A11Y_DECREASE_MODAL_COUNT,
});
