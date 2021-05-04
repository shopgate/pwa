// @flow
import React, { useContext } from 'react';
import { CardList, SurroundPortals } from '@shopgate/engage/components';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreCard } from './StoreCard';
import { stores, storeCard, storeCardPlaceholder } from './Store.style';
import { FULFILLMENT_SHEET_STORE_LIST } from '../../constants/Portals';

/**
 * Renders the locations.
 * @returns {JSX}
 */
function StoreListLocations() {
  const { locations, isLoading } = useContext(FulfillmentContext);

  if (!isLoading && (!locations || locations.length === 0)) {
    return null;
  }

  const showPlaceholder = isLoading && (!locations || locations.length === 0);

  return (
    <SurroundPortals
      portalName={FULFILLMENT_SHEET_STORE_LIST}
      portalProps={{ locations }}
    >
      <CardList className={stores}>
        <PlaceholderLabel className={storeCardPlaceholder} ready={!showPlaceholder}>
          {locations.map(location => (
            <CardList.Item className={storeCard} key={location.code}>
              <StoreContext.Provider value={location}>
                <StoreCard />
              </StoreContext.Provider>
            </CardList.Item>
          ))}
        </PlaceholderLabel>
      </CardList>
    </SurroundPortals>
  );
}

export default StoreListLocations;
