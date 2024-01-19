import { produce } from 'immer';
import {
  ADD_BACK_IN_STOCK_REMINDERS,
  ADD_BACK_IN_STOCK_REMINDERS_ERROR,
  ADD_BACK_IN_STOCK_REMINDERS_SUCCESS,
  FETCH_BACK_IN_STOCK_REMINDERS,
  FETCH_BACK_IN_STOCK_REMINDERS_ERROR,
  FETCH_BACK_IN_STOCK_REMINDERS_SUCCESS,
  REMOVE_BACK_IN_STOCK_REMINDERS,
  REMOVE_BACK_IN_STOCK_REMINDERS_ERROR,
  REMOVE_BACK_IN_STOCK_REMINDERS_SUCCESS,
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
      case FETCH_BACK_IN_STOCK_REMINDERS: {
        draft.isFetching = true;
        break;
      }
      case FETCH_BACK_IN_STOCK_REMINDERS_SUCCESS: {
        draft.isFetching = false;
        draft.subscriptions = action.subscriptions;
        break;
      }
      case FETCH_BACK_IN_STOCK_REMINDERS_ERROR: {
        draft.isFetching = false;
        break;
      }

      case ADD_BACK_IN_STOCK_REMINDERS: {
        draft.isFetching = true;
        break;
      }
      case ADD_BACK_IN_STOCK_REMINDERS_SUCCESS: {
        draft.isFetching = false;
        break;
      }
      case ADD_BACK_IN_STOCK_REMINDERS_ERROR: {
        draft.isFetching = false;
        break;
      }

      case REMOVE_BACK_IN_STOCK_REMINDERS: {
        draft.isFetching = true;
        break;
      }
      case REMOVE_BACK_IN_STOCK_REMINDERS_SUCCESS: {
        draft.isFetching = false;
        break;
      }
      case REMOVE_BACK_IN_STOCK_REMINDERS_ERROR: {
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
