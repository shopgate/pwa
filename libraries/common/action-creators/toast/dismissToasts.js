import { DISMISS_TOASTS } from '../../constants/ActionTypes';

/**
 * Creates the dispatched FLUSH_TOAST action object.
 * @return {Object} A Redux action.
 */
const dismissToasts = () => ({
  type: DISMISS_TOASTS,
});

export default dismissToasts;
