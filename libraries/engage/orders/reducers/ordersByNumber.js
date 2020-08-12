import { produce } from 'immer';
import {
  REQUEST_ORDER_DETAILS,
  RECEIVE_ORDER_DETAILS,
  RECEIVE_ORDER_HISTORY,
  ERROR_ORDER_DETAILS,
  CLEAR_ORDERS,
} from '../constants';

export const CACHE_TIME = 60 * 60 * 1000; // 1 hr in milliseconds

const defaultState = {};

/**
 * Stores orders by the order number.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
const ordersByNumber = (state = defaultState, action) => {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case REQUEST_ORDER_DETAILS: {
        if (!action.orderNumber) break;
        draft[action.orderNumber] = {
          ...draft[action.orderNumber],
          isFetching: true,
          expires: 0,
        };

        break;
      }

      case RECEIVE_ORDER_DETAILS: {
        draft[action.order.orderNumber] = {
          ...draft[action.order.orderNumber],
          order: {
            ...action.order,
            lineItemCount: action.order.lineItems.length,
          },
          isFetching: false,
          expires: Date.now() + CACHE_TIME,
        };
        break;
      }

      case RECEIVE_ORDER_HISTORY: {
        action.orders.forEach((order) => {
          draft[order.orderNumber] = {
            ...draft[order.orderNumber],
            order: {
              ...draft[order.orderNumber]?.order,
              ...order,
            },
          };
        });
        break;
      }

      case ERROR_ORDER_DETAILS: {
        if (!action.orderNumber) break;
        draft[action.orderNumber] = {
          isFetching: false,
          expires: 0,
        };
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

export default ordersByNumber;
