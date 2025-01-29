import React, { useContext, useCallback, useMemo } from 'react';
import { Grid, ResponsiveContainer, LocationIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { StoreContext } from './Store.context';
import { StoreFinderContext } from '../../locations.context';
import { StoreDistance } from '../StoreList/StoreDistance';
import { StoreHoursToday } from '../StoreList/StoreHoursToday';
import { StoreAddress } from '../StoreList/StoreAddress';
import StoreFinderLocationHeaderPhoneNumber from './StoreFinderLocationHeaderPhoneNumber';
import {
  container,
  storeName,
  storeDistance,
  storeHoursToday,
  clickable,
  storeNameWrapper,
  myStore,
  myStoreIcon,
  myStoreWrapper,
} from './StoreFinderLocationHeader.style';

/**
 * @returns {JSX}
 */
const StoreFinderLocationHeader = () => {
  const store = useContext(StoreContext);
  const {
    name, distance, unitSystem, operationHours, address,
  } = store;
  const { changeLocation, selectedLocation } = useContext(StoreFinderContext);

  const isSelectedLocation = useMemo(() =>
    selectedLocation?.code === store?.code,
  [selectedLocation, store]);

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
          <Grid.Item grow={1}>
            <div className={storeNameWrapper}>
              <div className={storeName}>
                { name }
              </div>
              {isSelectedLocation && (
                <div className={myStoreWrapper}>
                  <div className={myStoreIcon}>
                    <LocationIcon size={20} />
                  </div>
                  <div className={myStore}>
                    {i18n.text('location.myStore')}
                  </div>
                </div>
              )}
            </div>
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
