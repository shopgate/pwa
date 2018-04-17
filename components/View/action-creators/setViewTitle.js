import { SET_VIEW_TITLE } from '../constants';

/**
 * Creates the dispatched SET_VIEW_TITLE action object.
 * @param {string} title The title of the view.
 * @returns {Object} The dispatched action object.
 */
const setViewTitle = title => ({
  type: SET_VIEW_TITLE,
  title,
});

export default setViewTitle;
