import { SET_VIEW_TOP } from '../constants';

/**
 * Creates the dispatched SET_VIEW_TOP action object.
 * @param {boolean} isTop Whether or not the view is scrolled to the top.
 * @returns {Object} The dispatched action object.
 */
const setViewTop = isTop => ({
  type: SET_VIEW_TOP,
  isTop,
});

export default setViewTop;
