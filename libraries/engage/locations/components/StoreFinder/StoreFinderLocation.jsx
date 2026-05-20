import React, { useContext, useMemo } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { StoreContext } from './Store.context';
import { StoreFinderContext } from '../../locations.context';
import StoreFinderLocationHeader from './StoreFinderLocationHeader';
import { StoreFinderSelectLocationButton } from './StoreFinderSelectLocationButton';
import StoreFinderStoreInfoButton from './StoreFinderStoreInfoButton';

const useStyles = makeStyles()({
  container: {},
  selected: {},
});

/**
 * @returns {JSX.Element}
 */
const StoreFinderLocation = () => {
  const { classes, cx } = useStyles();
  const store = useContext(StoreContext);
  const { selectedLocation } = useContext(StoreFinderContext);

  const isSelected = useMemo(() => {
    const { code } = selectedLocation || {};
    return store.code === code;
  }, [selectedLocation, store.code]);

  return (
    <div
      className={cx(classes.container, { [classes.selected]: isSelected })}
      data-location-code={store.code}
    >
      <StoreFinderLocationHeader />
      <StoreFinderSelectLocationButton />
      <StoreFinderStoreInfoButton />
    </div>
  );
};

export default StoreFinderLocation;
