import React, { useContext } from 'react';
import { Grid, ResponsiveContainer, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { isProductAvailable } from '../../helpers';
import { FulfillmentContext } from '../../locations.context';
import { StoreContext } from './Store.context';
import { StoreDistance } from './StoreDistance';
import { StoreHoursToday } from './StoreHoursToday';
import { StoreSelectLocationButton } from './StoreSelectLocationButton';
import { StockInfo } from '../StockInfo';

const useStyles = makeStyles()(theme => ({
  storeHeader: {
    cursor: 'pointer',
    padding: theme.spacing(1, 2, 0.5),
  },
  disabled: {
    cursor: 'not-allowed',
  },
}));

/**
 * Renders a single store headline.
 * @returns {JSX}
 */
export function StoreHeader() {
  const { classes, cx } = useStyles();
  const store = useContext(StoreContext);
  const { product } = useContext(FulfillmentContext);
  const isAvailable = isProductAvailable(store, store?.inventory);

  const { name, distance, unitSystem } = store;

  return (
    <div
      className={cx(classes.storeHeader, { [classes.disabled]: !isAvailable })}
    >
      <Grid>
        <Grid.Item grow={1}>
          <Typography variant="h4" component="div">
            {name}
          </Typography>
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
