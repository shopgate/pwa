import React, { useCallback, useContext } from 'react';
import { RippleButton } from '@shopgate/engage/components';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core';
import { StoreFinderContext } from '../../locations.context';
import { selectLocationButton, selectLocationButtonWrapper } from '../StoreList/Store.style';

/**
 * The StoreFinderSelectLocationButton component.
 * Renders if route query.selectLocation param is passed
 * @returns {JSX}
 */
export const StoreFinderSelectLocationButton = () => {
  const store = useContext(StoreContext);
  const { selectLocation, isLoading } = useContext(StoreFinderContext);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    selectLocation(store);
  }, [selectLocation, store]);

  return (
    <div className={selectLocationButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={selectLocationButton.toString()}
        disabled={(isLoading || store?.isComingSoon)}
      >
        {i18n.text('locations.select_location')}
      </RippleButton>
    </div>
  );
};
