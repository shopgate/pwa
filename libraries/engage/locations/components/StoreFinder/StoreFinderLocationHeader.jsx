import React, { useContext, useCallback } from 'react';
import { Grid, ResponsiveContainer } from '@shopgate/engage/components';
import { StoreContext } from './Store.context';
import { StoreFinderContext } from '../../locations.context';
import { StoreDistance } from '../StoreList/StoreDistance';
import { StoreHoursToday } from '../StoreList/StoreHoursToday';
import { StoreAddress } from '../StoreList/StoreAddress';
import StoreFinderLocationHeaderPhoneNumber from './StoreFinderLocationHeaderPhoneNumber';
import {
  container, storeName, storeDistance, storeHoursToday, clickable,
} from './StoreFinderLocationHeader.style';

/**
 * @returns {JSX}
 */
const StoreFinderLocationHeader = () => {
  const store = useContext(StoreContext);
  const {
    name, distance, unitSystem, operationHours, address,
  } = store;
  const { selectLocation } = useContext(StoreFinderContext);

  const handleClick = useCallback(() => {
    selectLocation(store);
  }, [selectLocation, store]);

  return (
    <div
      className={container}
    >
      <div
        className={clickable}
        role="button"
        tabIndex="0"
        onClick={handleClick}
        onKeyDown={handleClick}
      >
        <Grid>
          <Grid.Item grow={1} className={storeName}>
            { name }
          </Grid.Item>
          <Grid.Item className={storeDistance}>
            <StoreDistance distance={distance} unitSystem={unitSystem} />
          </Grid.Item>
        </Grid>
        <ResponsiveContainer breakpoint=">sm" webOnly>
          <div className={storeHoursToday}>
            <StoreHoursToday hours={operationHours} longLabel />
          </div>
          <StoreAddress address={address} pure />
        </ResponsiveContainer>
        <ResponsiveContainer breakpoint="<=sm" appAlways>
          <div className={storeHoursToday}>
            <StoreHoursToday hours={operationHours} />
          </div>
          <StoreAddress address={address} />

        </ResponsiveContainer>
      </div>

      <ResponsiveContainer breakpoint="<=sm" appAlways>
        <StoreFinderLocationHeaderPhoneNumber phone={address.phoneNumber} />
      </ResponsiveContainer>
    </div>
  );
};

export default StoreFinderLocationHeader;
