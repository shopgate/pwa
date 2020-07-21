// @flow
import React, { useContext } from 'react';
import { CardList } from '@shopgate/engage/components';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreCard } from './StoreCard';
import { stores, storeCard } from './Store.style';

/**
 * Renders the locations.
 * @returns {JSX}
 */
function StoreListLocations() {
  const { locations } = useContext(FulfillmentContext);
  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <CardList className={stores}>
      {locations.map(location => (
        <CardList.Item className={storeCard} key={location.code}>
          <StoreContext.Provider value={location}>
            <StoreCard />
          </StoreContext.Provider>
        </CardList.Item>
      ))}
    </CardList>
  );
}

export default StoreListLocations;
