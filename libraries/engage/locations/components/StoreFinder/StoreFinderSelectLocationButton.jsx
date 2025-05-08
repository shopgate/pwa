import React, { useCallback, useContext, useMemo } from 'react';
import { RippleButton } from '@shopgate/engage/components';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core';
import { StoreFinderContext } from '../../locations.context';
import { selectLocationButton, selectLocationButtonWrapper } from '../StoreList/Store.style';

/**
 * The StoreFinderSelectLocationButton component.
 * Renders if route query.selectLocation param is passed
 * @returns {JSX.Element}
 */
export const StoreFinderSelectLocationButton = () => {
  const store = useContext(StoreContext);
  const { selectLocation, isLoading, selectedLocation } = useContext(StoreFinderContext);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    selectLocation(store);
  }, [selectLocation, store]);

  const isSelected = useMemo(() =>
    selectedLocation?.code === store?.code,
  [selectedLocation, store]);

  return (
    <div className={selectLocationButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={selectLocationButton.toString()}
        disabled={(isLoading || store?.isComingSoon || isSelected)}
      >
        {i18n.text(
          store?.isComingSoon ?
            'location.comingSoon' :
            'locations.select_location'
        )}
      </RippleButton>
    </div>
  );
};
