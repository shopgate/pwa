import { PipelineRequest } from '../../core';
import selectLocation from '../action-creators/selectLocation';

/**
 * Fetches the default location of the user
 * @returns {Function} redux thunk
 */
export const fetchDefaultLocation = () => async (dispatch) => {
  const request = new PipelineRequest('shopgate.user.getDefaultLocation')
    .dispatch();

  try {
    const { location } = await request;

    dispatch(selectLocation(location));
  } catch (error) {
    throw error;
  }
  return request;
};
