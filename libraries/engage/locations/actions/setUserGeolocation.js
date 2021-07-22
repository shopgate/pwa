import { getGeolocation, shouldFetchData } from '@shopgate/engage/core';
import { setUserGeolocation } from '../action-creators';
import { getUserGeolocation } from '../selectors';

export default ({
  silent = false,
  useFallback = false,
} = {}) => async (dispatch, getState) => {
  let geolocation = getUserGeolocation(getState());

  if (!shouldFetchData(geolocation)) {
    return Promise.resolve(geolocation);
  }

  try {
    geolocation = await dispatch(getGeolocation({
      useSettingsModal: !silent,
      requestPermissions: !useFallback,
    }));

    dispatch(setUserGeolocation(geolocation, silent));

    return geolocation;
  } catch (err) {
    return null;
  }
};

