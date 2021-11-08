import React, { useContext, useCallback } from 'react';
import { RippleButton } from '@shopgate/engage/components';
import { isProductAvailable } from '../../helpers';
import { StoreContext } from './Store.context';
import { i18n, useWidgetSettings } from '../../../core';
import { FulfillmentContext } from '../../locations.context';
import { selectLocationButton, selectLocationButtonWrapper } from './Store.style';
import connect from './StoreListSearch.connector';

/**
 * The StoreSelectLocationButton component.
 * @returns {JSX}
 */
export const StoreSelectLocationButton = connect(({ setPostalCode }) => {
  const store = useContext(StoreContext);
  const { setUserSearchZipLocationFromSelection = true } = useWidgetSettings('@shopgate/engage/locations') || {};

  const {
    selectLocation, noInventory, isLoading, product,
  } = useContext(FulfillmentContext);

  const isAvailable = isProductAvailable(store, store?.inventory);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (noInventory || isAvailable) {
      if (setUserSearchZipLocationFromSelection) {
        setPostalCode(store.address.postalCode, product.id);
      }
      selectLocation(store);
    }
  }, [
    isAvailable,
    noInventory,
    product.id,
    selectLocation,
    setPostalCode,
    setUserSearchZipLocationFromSelection,
    store,
  ]);

  return (
    <div className={selectLocationButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={selectLocationButton.toString()}
        disabled={(isLoading || store?.isComingSoon || (!noInventory && !isAvailable))}
      >
        {i18n.text('locations.select_location')}
      </RippleButton>
    </div>
  );
});
