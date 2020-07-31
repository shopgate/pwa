import { produce } from 'immer';
import {
  REQUEST_ORDER_HISTORY,
  RECEIVE_ORDER_HISTORY,
  ERROR_ORDER_HISTORY,
  CLEAR_ORDERS,
} from '../constants';

export const CACHE_TIME = 60 * 60 * 1000; // 1 hr in milliseconds

const defaultState = {
  orders: [],
};

/**
 * Stores orders by the order number.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
const orders = (state = defaultState, action) => {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case REQUEST_ORDER_HISTORY: {
        draft.isFetching = true;
        break;
      }

      case RECEIVE_ORDER_HISTORY: {
        draft.isFetching = false;
        draft.orders = action.orders;
        break;
      }

      case ERROR_ORDER_HISTORY: {
        draft.isFetching = false;
        break;
      }

      case CLEAR_ORDERS: {
        return defaultState;
      }

      default:
        break;
    }

    return undefined;
  });

  /* eslint-enable no-param-reassign */
  return producer(state);
};

export default orders;
