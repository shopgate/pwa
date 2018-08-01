import removeToast from '../../action-creators/toast/removeToast';

/**
 * Remove action.
 * @param {number} id Id.
 * @returns {function}
 */
export default function removeToastAction(id) {
  return (dispatch) => {
    dispatch(removeToast(id));
  };
}
