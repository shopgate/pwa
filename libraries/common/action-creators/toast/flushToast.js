import { FLUSH_TOAST } from '../../constants/ActionTypes';

/**
 * Creates the dispatched FLUSH_TOAST action object.
 * @return {Object} A Redux action.
 */
const flushToast = () => ({
  type: FLUSH_TOAST,
});

export default flushToast;
