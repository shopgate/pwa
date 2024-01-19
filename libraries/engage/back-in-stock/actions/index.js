import { PipelineRequest } from '@shopgate/engage/core';
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

/**
 * @returns {Function}
 */
export const fetchBackInStoreReminders = () => async (dispatch) => {
  dispatch({ type: FETCH_BACK_IN_STOCK_REMINDERS });

  const pipelineRequest = new PipelineRequest('shopgate.user.getBackInStockSubscriptions');

  try {
    const { subscriptions } = await pipelineRequest
      .setInput({
        limit: 100,
        offset: 100,
      })
      .dispatch();

    dispatch({
      type: FETCH_BACK_IN_STOCK_REMINDERS_SUCCESS,
      subscriptions,
    });
    return subscriptions;
  } catch (error) {
    dispatch({
      type: FETCH_BACK_IN_STOCK_REMINDERS_ERROR,
      error,
    });

    return null;
  }
};

/**
 * @returns {Function}
 */
export const addBackInStoreSubscription = ({ productCode }) => async (dispatch) => {
  dispatch({ type: ADD_BACK_IN_STOCK_REMINDERS });

  const pipelineRequest = new PipelineRequest('shopgate.user.addBackInStockSubscription');

  try {
    const { subscriptions } = await pipelineRequest
      .setInput({
        productCode,
      })
      .dispatch();

    dispatch({
      type: ADD_BACK_IN_STOCK_REMINDERS_SUCCESS,
      subscriptions,
    });
    return subscriptions;
  } catch (error) {
    dispatch({
      type: ADD_BACK_IN_STOCK_REMINDERS_ERROR,
      error,
    });

    return null;
  }
};

/**
 * @returns {Function}
 */
export const removeBackInStoreSubscription = ({ subscriptionCode }) => async (dispatch) => {
  dispatch({ type: REMOVE_BACK_IN_STOCK_REMINDERS });

  const pipelineRequest = new PipelineRequest('shopgate.user.removeBackInStockSubscription');

  try {
    const { subscriptions } = await pipelineRequest
      .setInput({
        subscriptionCode,
      })
      .dispatch();

    dispatch({
      type: REMOVE_BACK_IN_STOCK_REMINDERS_SUCCESS,
      subscriptions,
    });
    return subscriptions;
  } catch (error) {
    dispatch({
      type: REMOVE_BACK_IN_STOCK_REMINDERS_ERROR,
      error,
    });

    return null;
  }
};

