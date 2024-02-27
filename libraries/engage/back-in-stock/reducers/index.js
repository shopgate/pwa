import {
  ADD_BACK_IN_STOCK_SUBSCRIPTION,
  ADD_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
  ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS, FETCH_BACK_IN_STOCK_SUBSCRIPTIONS,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_ERROR,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_SUCCESS,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
} from '@shopgate/engage/back-in-stock/constants';

const initialState = {
  isFetching: false,
  isInitial: true,
  subscriptions: [],
};

/**
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BACK_IN_STOCK_SUBSCRIPTIONS: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_SUCCESS: {
      return {
        ...state,
        isInitial: false,
        isFetching: false,
        subscriptions: action.subscriptions,
      };
    }
    case FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_ERROR: {
      return {
        ...state,
        isFetching: false,
      };
    }

    case ADD_BACK_IN_STOCK_SUBSCRIPTION: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        isFetching: false,
      };
    }
    case ADD_BACK_IN_STOCK_SUBSCRIPTION_ERROR: {
      return {
        ...state,
        isFetching: false,
      };
    }

    case REMOVE_BACK_IN_STOCK_SUBSCRIPTION: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        isFetching: false,
      };
    }
    case REMOVE_BACK_IN_STOCK_SUBSCRIPTION_ERROR: {
      return {
        ...state,
        isFetching: false,
      };
    }
    default:
      return state;
  }
};
