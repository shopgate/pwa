import React, {
  useMemo, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core/hooks';
import {
  getPreferredLocation,
  makeGetLocation,
  makeGetNearbyLocationsByLocationCode,
} from '../selectors';
import connect from './StoreFinder.connector';
import { StoreDetailsContext } from './StoreDetailsContext';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreDetailsProvider = ({
  children,
  selectGlobalLocation,
  selectLocation,
}) => {
  const { params: { code: locationCode } } = useRoute();

  const getLocation = useMemo(() => makeGetLocation(() => locationCode), [locationCode]);
  const routeLocation = useSelector(getLocation);

  const preferredLocation = useSelector(getPreferredLocation);

  const isRouteLocationPreferred = useMemo(() => preferredLocation && routeLocation
    && preferredLocation.code === routeLocation.code,
  [preferredLocation, routeLocation]);

  const getNearbyLocations = useMemo(
    () => makeGetNearbyLocationsByLocationCode(locationCode),
    [locationCode]
  );
  const nearbyLocations = useSelector(getNearbyLocations);

  const selectLocationCb = useCallback(async (location) => {
    await selectLocation({
      location,
      showToast: true,
    });

    if (location.code !== preferredLocation?.code) {
      // Only dispatch selectGlobalLocation when location really changed, since this action
      // might clear product data from the resultsByHash product storage.
      selectGlobalLocation(location);
    }
  }, [preferredLocation, selectLocation, selectGlobalLocation]);

  const value = useMemo(() => ({
    preferredLocation,
    routeLocation,
    nearbyLocations,
    isRouteLocationPreferred,
    selectLocation: selectLocationCb,
  }),
  [isRouteLocationPreferred,
    nearbyLocations,
    preferredLocation,
    routeLocation,
    selectLocationCb,
  ]);

  return (
    <StoreDetailsContext.Provider value={value}>
      {children}
    </StoreDetailsContext.Provider>
  );
};

StoreDetailsProvider.propTypes = {
  selectGlobalLocation: PropTypes.func.isRequired,
  selectLocation: PropTypes.func.isRequired,
  children: PropTypes.node,

};

StoreDetailsProvider.defaultProps = {
  children: null,
};

export default connect(StoreDetailsProvider);
