import {
  PUSH_OPT_IN_INCREASE_APP_START_COUNT,
  PUSH_OPT_IN_RESET_APP_START_STATE,
  PUSH_OPT_IN_RESET_APP_START_COUNT,
  PUSH_OPT_IN_INCREASE_ORDERS_PLACED_COUNT,
  PUSH_OPT_IN_RESET_ORDERS_PLACED_COUNT,
  PUSH_OPT_IN_RESET_ORDERS_PLACED_STATE,
  PUSH_OPT_IN_SET_LAST_POPUP_TIMESTAMP,
  PUSH_OPT_IN_INCREASE_REJECTION_COUNT,
} from '../constants';

const defaultState = {
  appStartCount: 0,
  appStartResetCount: 0,

  ordersPlacedCount: 0,
  ordersPlacedResetCount: 0,

  lastPopupAt: null,
  rejectionCount: 0,
};

/**
 * Stores all the states related to the pushOptInTrigger functionality.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const pushOptInReducer = (state = defaultState, action) => {
  switch (action.type) {
    case PUSH_OPT_IN_INCREASE_APP_START_COUNT: {
      return {
        ...state,
        appStartCount: state.appStartCount + 1,
      };
    }
    case PUSH_OPT_IN_RESET_APP_START_COUNT: {
      return {
        ...state,
        appStartCount: 0,
        appStartResetCount: state.appStartResetCount + 1,
      };
    }
    case PUSH_OPT_IN_RESET_APP_START_STATE: {
      return {
        ...state,
        appStartCount: 0,
        appStartResetCount: 0,
      };
    }

    case PUSH_OPT_IN_INCREASE_ORDERS_PLACED_COUNT: {
      return {
        ...state,
        ordersPlacedCount: state.ordersPlacedCount + 1,
      };
    }
    case PUSH_OPT_IN_RESET_ORDERS_PLACED_COUNT: {
      return {
        ...state,
        ordersPlacedCount: 0,
        ordersPlacedResetCount: state.ordersPlacedResetCount + 1,
      };
    }
    case PUSH_OPT_IN_RESET_ORDERS_PLACED_STATE: {
      return {
        ...state,
        ordersPlacedCount: 0,
        ordersPlacedResetCount: 0,
      };
    }

    case PUSH_OPT_IN_SET_LAST_POPUP_TIMESTAMP: {
      return {
        ...state,
        lastPopupAt: Date.now(),
      };
    }
    case PUSH_OPT_IN_INCREASE_REJECTION_COUNT: {
      return {
        ...state,
        rejectionCount: state.rejectionCount + 1,
      };
    }

    default:
      return state;
  }
};

export default pushOptInReducer;
