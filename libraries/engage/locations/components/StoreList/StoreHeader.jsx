import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { Grid, ResponsiveContainer } from '@shopgate/engage/components';
import { isProductAvailable } from '../../helpers';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreDistance } from './StoreDistance';
import { StoreHoursToday } from './StoreHoursToday';
import { StoreSelectLocationButton } from './StoreSelectLocationButton';
import { StockInfo } from '../StockInfo';
import { storeHeader, storeName, disabled } from './Store.style';

/**
 * Renders a single store headline.
 * @returns {JSX}
 */
export function StoreHeader() {
  const store = useContext(StoreContext);
  const { selectLocation, product } = useContext(FulfillmentContext);
  const isAvailable = isProductAvailable(store, store?.inventory);

  const handleClick = useCallback(() => {
    if (isAvailable) {
      selectLocation(store);
    }
  }, [isAvailable, selectLocation, store]);

  const { name, distance, unitSystem } = store;

  return (
    <div
      className={classNames(storeHeader, { [disabled]: !isAvailable })}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={0}
    >
      <Grid>
        <Grid.Item grow={1} className={storeName}>
          {name}
          <ResponsiveContainer breakpoint=">=sm" webOnly>
            <ul>
              <Grid.Item shrink={0}>
                <StockInfo location={store} product={product} showStoreName={false} />
                <StoreDistance distance={distance} unitSystem={unitSystem} />
              </Grid.Item>
            </ul>
          </ResponsiveContainer>
        </Grid.Item>
        <ResponsiveContainer breakpoint="<sm" appAlways>
          <Grid.Item shrink={0}>
            <StoreDistance distance={distance} unitSystem={unitSystem} />
          </Grid.Item>
        </ResponsiveContainer>
        <ResponsiveContainer breakpoint=">=sm" webOnly>
          <Grid.Item shrink={0}>
            <StoreSelectLocationButton />
          </Grid.Item>
        </ResponsiveContainer>
      </Grid>
      <StoreHoursToday hours={store.operationHours} />
    </div>
  );
}
