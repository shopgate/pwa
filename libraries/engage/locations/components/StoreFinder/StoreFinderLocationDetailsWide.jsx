import React, { Fragment, useMemo, useContext } from 'react';
import { every, isEmpty } from 'lodash';
import { Grid, I18n } from '@shopgate/engage/components';
import { StoreFinderContext } from '../../locations.context';
import { StoreAddress } from '../StoreList/StoreAddress';
import { StoreOpeningHours } from '../StoreList/StoreOpeningHours';
import { StoreHoursToday } from '../StoreList/StoreHoursToday';
import { StoreDistance } from '../StoreList/StoreDistance';
import StoreFinderGetDirectionsButton from './StoreFinderGetDirectionsButton';
import StoreFinderLocationHeaderPhoneNumber from './StoreFinderLocationHeaderPhoneNumber';
import {
  container,
  headingLine,
  storeName,
  storeHours,
  storeDistance,
  storeDetailsLine,
  storeAddress,
  storePhoneNumber,
  storeOpeningHours,
  directionButton,
} from './StoreFinderLocationDetailsWide.style';

/**
 * @returns {JSX}
 */
const StoreFinderLocationDetailsWide = () => {
  const { selectedLocation: location, locations } = useContext(StoreFinderContext);

  const hasOperationHours = useMemo(() => {
    const { operationHours } = location || {};
    return operationHours && !every(operationHours, isEmpty);
  }, [location]);

  if (!location || locations.length === 0) {
    return null;
  }

  return (
    <div className={container}>

      <Grid className={headingLine}>
        <Grid.Item grow={1}>
          <div className={storeName}>
            { location.name }
          </div>
          <div className={storeHours}>
            <StoreHoursToday hours={location.operationHours} longLabel />
          </div>
        </Grid.Item>
        <Grid.Item>
          <div className={storeDistance}>
            <StoreDistance distance={location.distance} unitSystem={location.unitSystem} />
          </div>
          <StoreFinderGetDirectionsButton address={location.address} className={directionButton} />
        </Grid.Item>
      </Grid>

      <Grid className={storeDetailsLine}>
        <Grid.Item>
          <div className={storeAddress}>
            <StoreAddress pure address={location.address} />
          </div>
          { location.address.phoneNumber && (
            <div className={storePhoneNumber}>
              <I18n.Text string="locations.phone" />
              {': '}
              <StoreFinderLocationHeaderPhoneNumber phone={location.address.phoneNumber} pure />
            </div>
          )}
        </Grid.Item>

        <Grid.Item className={storeOpeningHours}>
          { hasOperationHours && (
            <Fragment>
              <I18n.Text string="locations.store_hours" />
              {':'}
              <StoreOpeningHours pure hours={location.operationHours} />
            </Fragment>
          )}
        </Grid.Item>
      </Grid>
    </div>
  );
};

export default StoreFinderLocationDetailsWide;
