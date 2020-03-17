// @flow
import React, { useCallback, useContext } from 'react';
import { Grid } from '@shopgate/engage/components';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreDistance } from './StoreDistance';
import { StoreHoursToday } from './StoreHoursToday';
import { storeHeader, storeName } from './Store.style';

/**
 * Renders a single store headline.
 * @returns {JSX}
 */
export function StoreHeader() {
  const store = useContext(StoreContext);
  const { selectLocation } = useContext(FulfillmentContext);

  const handleClick = useCallback(() => {
    selectLocation(store);
  }, [selectLocation, store]);

  const { name, distance, unitSystem } = store;

  return (
    <div
      className={storeHeader}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={0}
    >
      <Grid>
        <Grid.Item grow={1} className={storeName}>
          {name}
        </Grid.Item>
        <Grid.Item shrink={0}>
          <StoreDistance distance={distance} unitSystem={unitSystem} />
        </Grid.Item>
      </Grid>
      <StoreHoursToday hours={store.operationHours} />
    </div>
  );
}
