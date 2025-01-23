import React, {
  useMemo, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentRoute } from '@shopgate/engage/core';
import {
  getPreferredLocation,
  makeGetNearbyLocationsByRouteLocation,
  makeGetLocation,
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
  const preferredLocation = useSelector(getPreferredLocation);
  const route = useSelector(getCurrentRoute);
  const getRouteLocation = useMemo(() => makeGetLocation(() => route.params.code), [route]);
  const routeLocation = useSelector(getRouteLocation);
  const isRouteLocationPreferred = useMemo(() => preferredLocation && routeLocation
    && preferredLocation.code === routeLocation.code,
  [preferredLocation, routeLocation]);

  const getNearbyLocations = useMemo(() => makeGetNearbyLocationsByRouteLocation(), []);
  const nearbyLocations = useSelector(getNearbyLocations);

  const selectLocationCb = useCallback((location) => {
    selectLocation(location, true);
    selectGlobalLocation(location);
  }, [selectLocation, selectGlobalLocation]);

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
