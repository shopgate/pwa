import React, { useContext, useCallback } from 'react';
import { RippleButton } from '@shopgate/engage/components';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core';
import { FulfillmentContext } from '../../locations.context';
import { selectLocationButton, selectLocationButtonWrapper } from './Store.style';

/**
 * The StoreSelectLocationButton component.
 * @returns {JSX}
 */
export const StoreSelectLocationButton = () => {
  const store = useContext(StoreContext);
  const { selectLocation } = useContext(FulfillmentContext);

  const handleClick = useCallback(() => {
    selectLocation(store);
  }, [selectLocation, store]);

  return (
    <div className={selectLocationButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={selectLocationButton.toString()}
      >
        {i18n.text('locations.select_location')}
      </RippleButton>
    </div>
  );
};
