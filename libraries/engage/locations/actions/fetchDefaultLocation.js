import { PipelineRequest } from '../../core';
import selectLocation from '../action-creators/selectLocation';

/**
 * Fetches the default location of the user
 * @returns {Function} redux thunk
 */
const fetchDefaultLocation = () => async (dispatch) => {
  const request = new PipelineRequest('shopgate.user.getDefaultLocation')
    .dispatch();

  const { location } = await request;

  if (location) {
    dispatch(selectLocation(location));
  }

  return request;
};

export default fetchDefaultLocation;
