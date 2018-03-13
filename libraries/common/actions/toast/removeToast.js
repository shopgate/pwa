import removeToast from '../../action-creators/toast/removeToast';

/**
 * Remove action.
 * @param {number} id Id.
 * @returns {function}
 */
const removeToastAction = id => (dispatch) => {
  dispatch(removeToast(id));
};

export default removeToastAction;
