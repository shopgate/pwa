import { getGeolocation } from '@shopgate/engage/core';
import setUserSearchGeolocation from '../action-creators/setUserSearchGeolocation';

export default ({ silent = false, useFallback = false }) => async (dispatch) => {
  try {
    const geolocation = await dispatch(getGeolocation({
      useSettingsModal: !silent,
      requestPermissions: !useFallback,
    }));
    dispatch(setUserSearchGeolocation(geolocation));
    // eslint-disable-next-line no-empty
  } catch (err) {}
};

