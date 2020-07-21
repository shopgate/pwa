import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { StoreContext } from './Store.context';
import { StoreFinderContext } from '../../locations.context';
import StoreFinderLocationHeader from './StoreFinderLocationHeader';
import StoreFinderLocationDetails from './StoreFinderLocationDetails';
import StoreFinderGetDirectionsButton from './StoreFinderGetDirectionsButton';
import { container, selected, directionsButton } from './StoreFinderLocation.style';

/**
 * @returns {JSX}
 */
const StoreFinderLocation = () => {
  const store = useContext(StoreContext);
  const { selectedLocation } = useContext(StoreFinderContext);

  const isSelected = useMemo(() =>
    store.code === selectedLocation.code,
  [selectedLocation.code, store.code]);

  return (
    <div
      className={classNames(container, { [selected]: isSelected })}
      data-location-code={store.code}
    >
      <StoreFinderLocationHeader />
      <ResponsiveContainer breakpoint="<=sm" appAlways>
        <StoreFinderLocationDetails />
        <StoreFinderGetDirectionsButton address={store.address} className={directionsButton} />
      </ResponsiveContainer>
    </div>
  );
};

export default StoreFinderLocation;
