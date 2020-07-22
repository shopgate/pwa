import React, {
  useMemo, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { StoreFinderContext } from '../locations.context';
import connect from './StoreFinder.connector';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderProvider = ({
  children,
  locations,
  preferredLocation,
  isFetching,
  shopSettings,
  userSearch,
  storeListRef,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(preferredLocation);

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

  const value = useMemo(() => ({
    locations,
    selectedLocation,
    selectLocation,
    isFetching,
    shopSettings,
    userSearch,
  }), [isFetching, locations, selectLocation, selectedLocation, shopSettings, userSearch]);

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
  preferredLocation: PropTypes.shape(),
  shopSettings: PropTypes.shape(),
  storeListRef: PropTypes.shape(),
  userSearch: PropTypes.shape(),
};

StoreFinderProvider.defaultProps = {
  children: null,
  locations: [],
  preferredLocation: null,
  storeListRef: null,
  isFetching: false,
  shopSettings: null,
  userSearch: null,
};

export default connect(StoreFinderProvider);
