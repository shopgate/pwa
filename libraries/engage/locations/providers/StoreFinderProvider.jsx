import React, {
  useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { getPreferredLocation } from '../selectors';
import { STORE_FINDER_PATTERN } from '../constants';
import { StoreFinderContext } from '../locations.context';
import connect from './StoreFinder.connector';
import { useNavigation } from '../../core';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderProvider = ({
  children,
  locations,
  isFetching,
  shopSettings,
  userSearch,
  storeFinderSearch,
  selectGlobalLocation,
  selectLocation,
}) => {
  const { pop } = useNavigation();

  const selectedLocation = useSelector(getPreferredLocation);

  const selectLocationCb = useCallback(async (location) => {
    await selectLocation({
      location,
      showToast: true,
    });

    if (location.code !== selectedLocation?.code) {
      // Only dispatch selectGlobalLocation when location really changed, since this action
      // might clear product data from the resultsByHash product storage.
      selectGlobalLocation(location);
    }

    // Back navigation
    pop();
  }, [selectedLocation, pop, selectLocation, selectGlobalLocation]);

  /**
   * @param {bool} loading
   */
  const setIsLoading = useCallback((loading) => {
    if (loading) {
      LoadingProvider.setLoading(STORE_FINDER_PATTERN);
      return;
    }

    LoadingProvider.unsetLoading(STORE_FINDER_PATTERN);
  }, []);

  const value = useMemo(() => ({
    locations,
    selectedLocation,
    selectLocation: selectLocationCb,
    isFetching,
    shopSettings,
    userSearch,
    storeFinderSearch,
    setIsLoading,
  }), [
    isFetching,
    locations,
    selectLocationCb,
    selectedLocation,
    shopSettings,
    storeFinderSearch,
    userSearch,
    setIsLoading,
  ]);

  return (
    <StoreFinderContext.Provider value={value}>
      {children}
    </StoreFinderContext.Provider>
  );
};

StoreFinderProvider.propTypes = {
  selectGlobalLocation: PropTypes.func.isRequired,
  selectLocation: PropTypes.func.isRequired,
  children: PropTypes.node,
  isFetching: PropTypes.bool,
  locations: PropTypes.arrayOf(PropTypes.shape()),
  shopSettings: PropTypes.shape(),
  storeFinderSearch: PropTypes.shape(),
  userSearch: PropTypes.shape(),
};

StoreFinderProvider.defaultProps = {
  children: null,
  locations: [],
  isFetching: false,
  shopSettings: null,
  userSearch: null,
  storeFinderSearch: null,
};

export default connect(StoreFinderProvider);
