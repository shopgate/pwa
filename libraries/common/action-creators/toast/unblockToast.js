import { UNBLOCK_TOASTS } from '../../constants/ActionTypes';

/**
 * Creates the dispatched UNBLOCK_TOAST action object.
 * @return {Object} A Redux action.
 */
const unblockToast = () => ({
  type: UNBLOCK_TOASTS,
});

export default unblockToast;
