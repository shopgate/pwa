import { produce } from 'immer';
import {
  FETCH_CHECKOUT_ORDER,
  FETCH_CHECKOUT_ORDER_SUCCESS,
  FETCH_CHECKOUT_ORDER_ERROR,
  CLEAR_CHECKOUT_ORDER,
  FETCH_PAYMENT_METHODS,
  FETCH_PAYMENT_METHODS_SUCCESS,
  FETCH_PAYMENT_METHODS_ERROR,
} from '../constants/actionTypes';

const initialState = {
  paymentMethods: {
    isFetching: false,
    data: [],
  },
  checkoutOrder: {
    isFetching: false,
    data: null,
    errors: [],
  },
  checkoutSubmit: {
    errors: [],
  },
};

/**
 * The reducer for all checkout related state.
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default function checkoutReducer(state = initialState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case FETCH_CHECKOUT_ORDER: {
        draft.checkoutOrder.isFetching = true;
        break;
      }

      case FETCH_CHECKOUT_ORDER_SUCCESS: {
        draft.checkoutOrder.isFetching = false;
        draft.checkoutOrder.errors = [];
        draft.checkoutOrder.data = action.order;
        break;
      }

      case FETCH_CHECKOUT_ORDER_ERROR: {
        draft.checkoutOrder.isFetching = false;
        draft.checkoutOrder.errors = action.errors;
        break;
      }

      case CLEAR_CHECKOUT_ORDER: {
        draft.checkoutOrder.isFetching = false;
        draft.checkoutOrder.errors = [];
        draft.checkoutOrder.data = null;
        break;
      }

      case FETCH_PAYMENT_METHODS: {
        draft.paymentMethods.isFetching = true;
        break;
      }

      case FETCH_PAYMENT_METHODS_SUCCESS: {
        draft.paymentMethods.isFetching = false;
        draft.paymentMethods.data = action.paymentMethods;
        break;
      }

      case FETCH_PAYMENT_METHODS_ERROR: {
        draft.paymentMethods.isFetching = false;
        break;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producer(state);
}
