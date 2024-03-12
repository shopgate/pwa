import { PipelineRequest } from '@shopgate/engage/core';
import {
  SHOPGATE_USER_ADD_BACK_IN_STOCK_SUBSCRIPTION,
  SHOPGATE_USER_DELETE_BACK_IN_STOCK_SUBSCRIPTION,
  SHOPGATE_USER_GET_BACK_IN_STOCK_SUBSCRIPTIONS,
  ADD_BACK_IN_STOCK_SUBSCRIPTION,
  ADD_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
  ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_ERROR,
  FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_SUCCESS,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
  REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
} from '@shopgate/engage/back-in-stock/constants';

/**
 * Fetch Back in Stock Subscriptions
 * @returns {Function}
 */
export const fetchBackInStockSubscriptions = () => (dispatch) => {
  dispatch({ type: FETCH_BACK_IN_STOCK_SUBSCRIPTIONS });

  const request = new PipelineRequest(SHOPGATE_USER_GET_BACK_IN_STOCK_SUBSCRIPTIONS)
    .setInput({
      limit: 100,
      filters: {
        status: { $in: ['active', 'triggered'] },
      },
    })
    .setRetries(0)
    .dispatch();

  request
    .then(({ subscriptions }) => {
      dispatch({
        type: FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_SUCCESS,
        subscriptions,
      });
    })
    .catch((error) => {
      dispatch({
        type: FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_ERROR,
        error,
      });
    });

  return request;
};

/**
 * Add a Back in Stock Subscription
 * @param {Object} props Props.
 * @param {string} props.productId The product for which the subscription should be added
 * @returns {Function}
 */
export const addBackInStockSubscription = ({ productId }) => (dispatch) => {
  dispatch({ type: ADD_BACK_IN_STOCK_SUBSCRIPTION });
  const request = new PipelineRequest(SHOPGATE_USER_ADD_BACK_IN_STOCK_SUBSCRIPTION)
    .setInput({
      productCode: productId,
    })
    .setRetries(0)
    .dispatch();

  request
    .then(({ subscriptions }) => {
      dispatch({
        type: ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
        subscriptions,
      });
    })
    .catch((error) => {
      dispatch({
        type: ADD_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
        error,
      });
    });

  return request;
};

/**
 * Remove a Back in Stock Subscription
 * @param {Object} props Props.
 * @param {string} props.subscriptionCode The subscription which should be deleted
 * @returns {Function}
 */
export const removeBackInStockSubscription = ({ subscriptionCode }) => (dispatch) => {
  dispatch({ type: REMOVE_BACK_IN_STOCK_SUBSCRIPTION });
  const request = new PipelineRequest(SHOPGATE_USER_DELETE_BACK_IN_STOCK_SUBSCRIPTION)
    .setInput({
      subscriptionCode,
    })
    .setRetries(0)
    .dispatch();

  request
    .then(({ subscriptions }) => {
      dispatch({
        type: REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
        subscriptions,
      });
    })
    .catch((error) => {
      dispatch({
        type: REMOVE_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
        error,
      });
    });

  return request;
};

