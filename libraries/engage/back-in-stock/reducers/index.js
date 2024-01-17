import { produce } from 'immer';
import { FETCH_BACK_IN_STOCK_REMINDERS_SUCCESS } from '../constants';
// import {
//   FETCH_CHECKOUT_ORDER,
//   FETCH_CHECKOUT_ORDER_SUCCESS,
//   FETCH_CHECKOUT_ORDER_ERROR,
//   CLEAR_CHECKOUT_ORDER,
//   FETCH_PAYMENT_METHODS,
//   FETCH_PAYMENT_METHODS_SUCCESS,
//   FETCH_PAYMENT_METHODS_ERROR,
//   ADD_CHECKOUT_CAMPAIGN,
//   CLEAR_CHECKOUT_CAMPAIGN,
// } from '../constants/actionTypes';

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
      // case FETCH_CHECKOUT_ORDER: {
      //   draft.checkoutOrder.isFetching = true;
      //   break;
      // }
      //
      case FETCH_BACK_IN_STOCK_REMINDERS_SUCCESS: {
        // draft.checkoutOrder.isFetching = false;
        // draft.checkoutOrder.errors = [];
        draft.subscriptions = action.subscriptions;
        break;
      }
      //
      // case FETCH_CHECKOUT_ORDER_ERROR: {
      //   draft.checkoutOrder.isFetching = false;
      //   draft.checkoutOrder.errors = action.errors;
      //   break;
      // }
      //
      // case CLEAR_CHECKOUT_ORDER: {
      //   draft.checkoutOrder.isFetching = false;
      //   draft.checkoutOrder.errors = [];
      //   draft.checkoutOrder.data = null;
      //   break;
      // }
      //
      // case FETCH_PAYMENT_METHODS: {
      //   draft.paymentMethods.isFetching = true;
      //   break;
      // }
      //
      // case FETCH_PAYMENT_METHODS_SUCCESS: {
      //   draft.paymentMethods.isFetching = false;
      //   draft.paymentMethods.data = action.paymentMethods;
      //   break;
      // }
      //
      // case FETCH_PAYMENT_METHODS_ERROR: {
      //   draft.paymentMethods.isFetching = false;
      //   break;
      // }
      //
      // case ADD_CHECKOUT_CAMPAIGN: {
      //   draft.checkoutCampaign = action.data;
      //   break;
      // }
      //
      // case CLEAR_CHECKOUT_CAMPAIGN: {
      //   draft.checkoutCampaign = initialState.checkoutCampaign;
      //   break;
      // }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producer(state);
}
