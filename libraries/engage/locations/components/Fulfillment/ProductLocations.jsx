// @flow
import React, { useContext, useMemo } from 'react';
import FulfillmentContext from '../context';
import connect from './ProductLocations.connector';
import { StoreList } from '../StoreList';
import { type OwnProps, type StateProps } from './ProductLocations.types';

type Props = OwnProps & StateProps;

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
}: Props) => {
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

ProductLocations.defaultProps = {
  product: null,
  locationId: null,
  locations: null,
  loading: false,
};

export default connect(ProductLocations);
