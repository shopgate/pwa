import React, {
  useMemo, useState, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { STORE_FINDER_PATTERN } from '../constants';
import { StoreFinderContext } from '../locations.context';
import connect from './StoreFinder.connector';

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
  storeListRef,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationsHash, setLocationsHash] = useState(null);

  const selectLocation = useCallback((location, scrollIntoView = false) => {
    setSelectedLocation(location);

    if (scrollIntoView && storeListRef.current) {
      const container = storeListRef.current;
      const element = container.querySelector(`[data-location-code="${location.code}"]`);

      const scrollParams = {
        top: (element.parentNode.offsetTop - container.offsetTop) - 10,
        behavior: 'smooth',
      };

      const { overflowY } = getComputedStyle(container);

      if (overflowY === 'scroll') {
        container.scroll(scrollParams);
      } else {
        window.scroll(scrollParams);
      }
    }
  }, [storeListRef]);

  useEffect(() => {
    const hash = JSON.stringify(locations.map(({ code }) => code));

    if (hash !== locationsHash) {
      setLocationsHash(hash);
      selectLocation(locations[0]);
    }
  });

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
    selectLocation,
    isFetching,
    shopSettings,
    userSearch,
    storeFinderSearch,
    setIsLoading,
  }), [
    isFetching,
    locations,
    selectLocation,
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
  children: PropTypes.node,
  isFetching: PropTypes.bool,
  locations: PropTypes.arrayOf(PropTypes.shape()),
  shopSettings: PropTypes.shape(),
  storeFinderSearch: PropTypes.shape(),
  storeListRef: PropTypes.shape(),
  userSearch: PropTypes.shape(),
};

StoreFinderProvider.defaultProps = {
  children: null,
  locations: [],
  storeListRef: null,
  isFetching: false,
  shopSettings: null,
  userSearch: null,
  storeFinderSearch: null,
};

export default connect(StoreFinderProvider);
