import { SET_FILTER_INDEX } from '../constants';

/**
 * Creates the dispatched SET_FILTER_INDEX action object.
 * @param {number} index The new filter index.
 * @return {Object} The ADD_ACTIVE_FILTERS action.
 */
const setFilterIndex = index => ({
  type: SET_FILTER_INDEX,
  index,
});

export default setFilterIndex;
