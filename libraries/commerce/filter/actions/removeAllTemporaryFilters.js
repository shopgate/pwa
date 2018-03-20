import removeTemporaryFilter from '../action-creators/removeTemporaryFilter';

/**
 * Removes all temporary filters.
 * @returns {Function} A redux thunk.
 */
const removeAllTemporaryFilters = () => (dispatch) => {
  dispatch(removeTemporaryFilter(null));
};

export default removeAllTemporaryFilters;
