import { PipelineRequest } from '@shopgate/engage/core';
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
import {
  SHOPGATE_USER_ADD_BACK_IN_STOCK_SUBSCRIPTION,
  SHOPGATE_USER_DELETE_BACK_IN_STOCK_SUBSCRIPTION,
  SHOPGATE_USER_GET_BACK_IN_STOCK_SUBSCRIPTIONS,
} from '../constants/Pipelines';

/**
 * Fetch Back in Stock Subscriptions
 * @returns {Function}
 */
export const fetchBackInStoreSubscriptions = () => async (dispatch) => {
  dispatch({ type: FETCH_BACK_IN_STOCK_SUBSCRIPTIONS });

  try {
    const { subscriptions } =
      await new PipelineRequest(SHOPGATE_USER_GET_BACK_IN_STOCK_SUBSCRIPTIONS)
        .setInput({
          limit: 100,
          offset: 0,
        })
        .dispatch();

    dispatch({
      type: FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_SUCCESS,
      subscriptions,
    });

    return subscriptions;
  } catch (error) {
    dispatch({
      type: FETCH_BACK_IN_STOCK_SUBSCRIPTIONS_ERROR,
      error,
    });

    return null;
  }
};

/**
 * Add a Back in Stock Subscription
 * @param {Object} props Props.
 * @param {string} props.productId The product for which the subscription should be added
 * @returns {Function}
 */
export const addBackInStoreSubscription = ({ productId }) => async (dispatch) => {
  dispatch({ type: ADD_BACK_IN_STOCK_SUBSCRIPTION });

  try {
    const { subscriptions } =
      await new PipelineRequest(SHOPGATE_USER_ADD_BACK_IN_STOCK_SUBSCRIPTION)
        .setInput({
          productCode: productId,
        })
        .dispatch();

    dispatch({
      type: ADD_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
      subscriptions,
    });
    return subscriptions;
  } catch (error) {
    dispatch({
      type: ADD_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
      error,
    });

    return null;
  }
};

/**
 * Remove a Back in Stock Subscription
 * @param {Object} props Props.
 * @param {string} props.subscriptionCode The subscription which should be deleted
 * @returns {Function}
 */
export const removeBackInStoreSubscription = ({ subscriptionCode }) => async (dispatch) => {
  dispatch({ type: REMOVE_BACK_IN_STOCK_SUBSCRIPTION });

  try {
    const { subscriptions } =
      await new PipelineRequest(SHOPGATE_USER_DELETE_BACK_IN_STOCK_SUBSCRIPTION)
        .setInput({
          subscriptionCode,
        })
        .dispatch();

    dispatch({
      type: REMOVE_BACK_IN_STOCK_SUBSCRIPTION_SUCCESS,
      subscriptions,
    });
    return subscriptions;
  } catch (error) {
    dispatch({
      type: REMOVE_BACK_IN_STOCK_SUBSCRIPTION_ERROR,
      error,
    });

    return null;
  }
};

