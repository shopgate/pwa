import { produce } from 'immer';
import { isDev, logger } from '@shopgate/engage/core/helpers';
import { A11Y_INCREASE_MODAL_COUNT, A11Y_DECREASE_MODAL_COUNT } from '../constants';

const defaultState = {
  modalCount: 0,
};

/**
 * Stores a11y state
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export default function a11y(state = defaultState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case A11Y_INCREASE_MODAL_COUNT: {
        draft.modalCount += 1;
        break;
      }
      case A11Y_DECREASE_MODAL_COUNT: {
        draft.modalCount -= 1;
        if (draft.modalCount < 0) {
          if (isDev) {
            logger.warn('Modal count is negative, resetting to 0');
          }
          draft.modalCount = 0;
        }
        break;
      }
      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */

  return producer(state);
}
