import {
  SET_NEXT_RULE,
  INCREMENT_APP_START_COUNT,
  RESET_APP_START_STATE,
  RESET_APP_START_COUNT,
  INCREMENT_ORDERS_PLACED_COUNT,
  RESET_ORDERS_PLACED_COUNT,
  RESET_ORDERS_PLACED_STATE,
  INCREMENT_TIMER_COUNT,
  RESET_TIMER_COUNT,
  RESET_TIMER_STATE,
} from '../constants';

const defaultState = {
  nextRule: null,

  appStartCount: 0,
  appStartResetCount: 0,

  ordersPlacedCount: 0,
  ordersPlacedResetCount: 0,

  timerCount: 0,
  timerResetCount: 0,
};

/**
 * Stores all the app rating states.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_NEXT_RULE: {
      // should reset state if next rule !== current rule?
      return {
        ...state,
        nextRule: action.rule,
      };
    }

    case INCREMENT_APP_START_COUNT: {
      return {
        ...state,
        appStartCount: state.appStartCount + 1,
      };
    }
    case RESET_APP_START_COUNT: {
      return {
        ...state,
        appStartCount: 0,
        appStartResetCount: state.appStartResetCount + 1,
      };
    }
    case RESET_APP_START_STATE: {
      return {
        ...state,
        appStartCount: 0,
        appStartResetCount: 0,
      };
    }

    case INCREMENT_ORDERS_PLACED_COUNT: {
      return {
        ...state,
        ordersPlacedCount: state.ordersPlacedCount + 1,
      };
    }
    case RESET_ORDERS_PLACED_COUNT: {
      return {
        ...state,
        ordersPlacedCount: 0,
        ordersPlacedResetCount: state.ordersPlacedResetCount + 1,
      };
    }
    case RESET_ORDERS_PLACED_STATE: {
      return {
        ...state,
        ordersPlacedCount: 0,
        ordersPlacedResetCount: 0,
      };
    }

    case INCREMENT_TIMER_COUNT: {
      return {
        ...state,
        timerCount: state.timerCount + 1,
      };
    }
    case RESET_TIMER_COUNT: {
      return {
        ...state,
        timerCount: 0,
        timerResetCount: state.timerResetCount + 1,
      };
    }
    case RESET_TIMER_STATE: {
      return {
        ...state,
        timerCount: 0,
        timerResetCount: 0,
      };
    }

    default:
      return state;
  }
};
