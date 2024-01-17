import { PipelineRequest } from '@shopgate/engage/core';
import {
  FETCH_BACK_IN_STOCK_REMINDERS,
  FETCH_BACK_IN_STOCK_REMINDERS_ERROR,
  FETCH_BACK_IN_STOCK_REMINDERS_SUCCESS,
} from '../constants';

/**
 * @returns {Function}
 */
export const fetchBackInStoreReminders = () => async (dispatch) => {
  dispatch({ type: FETCH_BACK_IN_STOCK_REMINDERS });

  const pipelineRequest = new PipelineRequest('shopgate.user.getBackInStockSubscriptions');

  try {
    const { subscriptions } = await pipelineRequest
      // .setErrorBlacklist([ERROR_CODE_CHECKOUT_GENERIC])
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

