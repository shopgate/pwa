// @flow
import React, { useContext } from 'react';
import classNames from 'classnames';
import { CardList } from '@shopgate/engage/components';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreCard } from './StoreCard';
import { stores, storeCard, storeCardSelected } from './Store.style';

/**
 * Renders the locations.
 * @returns {JSX}
 */
function StoreListLocations() {
  const { locations, location: selectedLocation, isStoreFinder } = useContext(FulfillmentContext);
  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <CardList className={stores}>
      {locations.map((location) => {
        const selected = isStoreFinder && (selectedLocation.code === location.code);
        const className = classNames(storeCard, { [storeCardSelected]: selected });

        return (
          <CardList.Item className={className} key={location.code}>
            <StoreContext.Provider value={location}>
              <StoreCard />
            </StoreContext.Provider>
          </CardList.Item>
        );
      })}
    </CardList>
  );
}

export default StoreListLocations;
