import { REMOVE_TOAST } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REMOVE_TOAST action object.
 * @param {Object} id The toast id.
 * @return {Object} A Redux action.
 */
const removeToast = id => ({
  type: REMOVE_TOAST,
  id,
});

export default removeToast;
