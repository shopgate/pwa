import { mutable } from '@shopgate/engage/core/helpers';
import { PipelineRequest } from '@shopgate/engage/core/classes';
import selectLocation from '../action-creators/selectLocation';
import { getPreferredLocation } from '../selectors';

/**
 * Fetches the default location of the user
 * @returns {Function} redux thunk
 */
const fetchDefaultLocation = () => async (dispatch, getState) => {
  const request = new PipelineRequest('shopgate.user.getDefaultLocation')
    .dispatch();

  const { location } = await request;
  const selectedLocationCode = getPreferredLocation(getState())?.code;

  if (selectedLocationCode !== location?.code || location === null) {
    await dispatch(selectLocation({
      location,
      skipLocationSync: true,
    }));
  }

  return request;
};

export default mutable(fetchDefaultLocation);
