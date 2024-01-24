import { produce } from 'immer';
import {
  ADD_BACK_IN_STOCK_SUBSCRIPTION,
  ADD_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
  ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_ERROR,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_SUCCESS,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
} from '../constants';

const initialState = {
  isFetching: false,
  subscriptions: [],
};

/**
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default function backInStockReducer(state = initialState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case FETCH_BACK_IN_STOCK_SUBSCRIPTIONS: {
        draft.isFetching = true;
        break;
      }
      case FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_SUCCESS: {
        draft.isFetching = false;
        draft.subscriptions = action.subscriptions;
        break;
      }
      case FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_ERROR: {
        draft.isFetching = false;
        break;
      }

      case ADD_BACK_IN_STOCK_SUBSCRIPTION: {
        draft.isFetching = true;
        break;
      }
      case ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS: {
        draft.isFetching = false;
        break;
      }
      case ADD_BACK_IN_STOCK_SUBSCRIPTION_ERROR: {
        draft.isFetching = false;
        break;
      }

      case REMOVE_BACK_IN_STOCK_SUBSCRIPTION: {
        draft.isFetching = true;
        break;
      }
      case REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS: {
        draft.isFetching = false;
        break;
      }
      case REMOVE_BACK_IN_STOCK_SUBSCRIPTION_ERROR: {
        draft.isFetching = false;
        break;
      }
      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producer(state);
}
