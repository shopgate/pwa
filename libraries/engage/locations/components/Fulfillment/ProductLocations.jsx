import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import FulfillmentContext from '../context';
import connect from './ProductLocations.connector';
import { StoreList } from '../StoreList';

/**
 * @param {Function} onLocationSelect onLocationSelect callback
 * @param {Object} product product
 * @param {string} locationId currently selected location
 * @param {Object[]} locations locations
 * @param {boolean} loading loading
 * @returns {JSX}
 */
const ProductLocations = ({
  onLocationSelect, product, locationId, locations, loading,
}) => {
  const context = useContext(FulfillmentContext);

  const sortedLocations = useMemo(() => (
    locations.sort((a, b) => {
      if (a.code === locationId) {
        return -1;
      }
      return b.code === locationId ? 1 : 0;
    })
  ), [locations, locationId]);

  return (
    <FulfillmentContext.Provider
      value={{
        ...context,
        product,
        locations: sortedLocations,
        loading,
        selectLocation: onLocationSelect,
      }}
    >
      <StoreList />
    </FulfillmentContext.Provider>
  );
};

ProductLocations.propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  locationId: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.shape()),
  product: PropTypes.shape(),
};

ProductLocations.defaultProps = {
  product: null,
  locationId: null,
  locations: null,
  loading: false,
};

export default connect(ProductLocations);
