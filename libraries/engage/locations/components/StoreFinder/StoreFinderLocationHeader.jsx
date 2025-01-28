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
  const { changeLocation } = useContext(StoreFinderContext);

  const handleClick = useCallback(() => {
    changeLocation(store);
  }, [changeLocation, store]);

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
        <div className={storeHoursToday}>
          <StoreHoursToday hours={operationHours} />
        </div>
        <StoreAddress address={address} />
      </div>

      <ResponsiveContainer breakpoint="<=sm" appAlways>
        <StoreFinderLocationHeaderPhoneNumber phone={address.phoneNumber} />
      </ResponsiveContainer>
    </div>
  );
};

export default StoreFinderLocationHeader;
