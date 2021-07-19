import { getGeolocation } from '@shopgate/engage/core';
import setUserSearchGeolocation from '../action-creators/setUserSearchGeolocation';

export default ({
  silent = false,
  useFallback = false,
  productId = null,
  isStoreFinder = false,
} = {}) => async (dispatch) => {
  try {
    const geolocation = await dispatch(getGeolocation({
      useSettingsModal: !silent,
      requestPermissions: !useFallback,
    }));

    dispatch(setUserSearchGeolocation(geolocation, productId, isStoreFinder, silent));

    return geolocation;
  } catch (err) {
    return null;
  }
};

