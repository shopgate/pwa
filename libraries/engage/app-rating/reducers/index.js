import {
  APP_RATING_INCREASE_APP_START_COUNT,
  APP_RATING_RESET_APP_START_STATE,
  APP_RATING_RESET_APP_START_COUNT,
  APP_RATING_INCREASE_ORDERS_PLACED_COUNT,
  APP_RATING_RESET_ORDERS_PLACED_COUNT,
  APP_RATING_RESET_ORDERS_PLACED_STATE,
  APP_RATING_INCREASE_TIMER_REPEATS,
  APP_RATING_SET_TIMER_START_TIME,
  APP_RATING_SET_LAST_POPUP_TIMESTAMP,
  APP_RATING_INCREASE_REJECTION_COUNT,
  APP_RATING_SET_ALREADY_RATED,
} from '../constants';

const defaultState = {
  appStartCount: 0,
  appStartResetCount: 0,

  ordersPlacedCount: 0,
  ordersPlacedResetCount: 0,

  timerRepeatsCount: 0,
  timerStartTimestamp: null,

  lastPopupAt: null,
  rejectionCount: 0,
  alreadyRated: false,
};

/**
 * Stores all the app rating states.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_RATING_INCREASE_APP_START_COUNT: {
      return {
        ...state,
        appStartCount: state.appStartCount + 1,
      };
    }
    case APP_RATING_RESET_APP_START_COUNT: {
      return {
        ...state,
        appStartCount: 0,
        appStartResetCount: state.appStartResetCount + 1,
      };
    }
    case APP_RATING_RESET_APP_START_STATE: {
      return {
        ...state,
        appStartCount: 0,
        appStartResetCount: 0,
      };
    }

    case APP_RATING_INCREASE_ORDERS_PLACED_COUNT: {
      return {
        ...state,
        ordersPlacedCount: state.ordersPlacedCount + 1,
      };
    }
    case APP_RATING_RESET_ORDERS_PLACED_COUNT: {
      return {
        ...state,
        ordersPlacedCount: 0,
        ordersPlacedResetCount: state.ordersPlacedResetCount + 1,
      };
    }
    case APP_RATING_RESET_ORDERS_PLACED_STATE: {
      return {
        ...state,
        ordersPlacedCount: 0,
        ordersPlacedResetCount: 0,
      };
    }

    case APP_RATING_INCREASE_TIMER_REPEATS: {
      return {
        ...state,
        timerRepeatsCount: state.timerRepeatsCount + 1,
      };
    }
    case APP_RATING_SET_TIMER_START_TIME: {
      return {
        ...state,
        timerStartTimestamp: Date.now(),
      };
    }

    case APP_RATING_SET_LAST_POPUP_TIMESTAMP: {
      return {
        ...state,
        lastPopupAt: Date.now(),
      };
    }
    case APP_RATING_INCREASE_REJECTION_COUNT: {
      return {
        ...state,
        rejectionCount: state.rejectionCount + 1,
      };
    }
    case APP_RATING_SET_ALREADY_RATED: {
      return {
        ...state,
        alreadyRated: action.to,
      };
    }

    default:
      return state;
  }
};
