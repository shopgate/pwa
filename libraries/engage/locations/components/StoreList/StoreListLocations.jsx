// @flow
import React, { useContext } from 'react';
import { CardList, SurroundPortals } from '@shopgate/engage/components';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreCard } from './StoreCard';
import { stores, storeCard } from './Store.style';
import { FULFILLMENT_SHEET_STORE_LIST } from '../../constants/Portals';

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
    <SurroundPortals
      portalName={FULFILLMENT_SHEET_STORE_LIST}
      portalProps={{ locations }}
    >
      <CardList className={stores}>
        {locations.map(location => (
          <CardList.Item className={storeCard} key={location.code}>
            <StoreContext.Provider value={location}>
              <StoreCard />
            </StoreContext.Provider>
          </CardList.Item>
        ))}
      </CardList>
    </SurroundPortals>
  );
}

export default StoreListLocations;
