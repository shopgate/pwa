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

/**
 * @returns {Function}
 */
export const fetchBackInStoreSubscriptions = () => async (dispatch) => {
  dispatch({ type: FETCH_BACK_IN_STOCK_SUBSCRIPTIONS });

  try {
    const { subscriptions } = await new PipelineRequest('shopgate.user.getBackInStockSubscriptions')
      .setInput({
        limit: 100,
        offset: 100,
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
 * @returns {Function}
 */
export const addBackInStoreSubscription = ({ productCode }) => async (dispatch) => {
  dispatch({ type: ADD_BACK_IN_STOCK_SUBSCRIPTION });

  const pipelineRequest = new PipelineRequest('shopgate.user.addBackInStockSubscription');

  try {
    const { subscriptions } = await pipelineRequest
      .setInput({
        productCode,
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
 * @returns {Function}
 */
export const removeBackInStoreSubscription = ({ subscriptionCode }) => async (dispatch) => {
  dispatch({ type: REMOVE_BACK_IN_STOCK_SUBSCRIPTION });

  const pipelineRequest = new PipelineRequest('shopgate.user.removeBackInStockSubscription');

  try {
    const { subscriptions } = await pipelineRequest
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

