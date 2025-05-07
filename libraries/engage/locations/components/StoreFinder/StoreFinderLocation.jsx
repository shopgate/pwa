import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { StoreContext } from './Store.context';
import { StoreFinderContext } from '../../locations.context';
import StoreFinderLocationHeader from './StoreFinderLocationHeader';
import { container, selected } from './StoreFinderLocation.style';
import { StoreFinderSelectLocationButton } from './StoreFinderSelectLocationButton';
import StoreFinderStoreInfoButton from './StoreFinderStoreInfoButton';

/**
 * @returns {JSX}
 */
const StoreFinderLocation = () => {
  const store = useContext(StoreContext);
  const { selectedLocation } = useContext(StoreFinderContext);

  const isSelected = useMemo(() => {
    const { code } = selectedLocation || {};
    return store.code === code;
  }, [selectedLocation, store.code]);

  return (
    <div
      className={classNames(container, { [selected]: isSelected })}
      data-location-code={store.code}
    >
      <StoreFinderLocationHeader />
      <StoreFinderSelectLocationButton />
      <StoreFinderStoreInfoButton />
    </div>
  );
};

export default StoreFinderLocation;
