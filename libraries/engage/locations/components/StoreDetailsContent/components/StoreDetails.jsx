import React from 'react';
import { css } from 'glamor';
import { LocationIcon, Button, Link } from '@shopgate/engage/components';
import { useDispatch, useSelector } from 'react-redux';
import { getPreferredLocation, makeGetLocation } from '@shopgate/engage/locations/selectors';
import {
  i18n, getWeekDaysOrder,
  getCurrentRoute,
} from '@shopgate/engage/core';
import { selectLocation } from '@shopgate/engage/locations/action-creators';
import classNames from 'classnames';
import moment from 'moment';

import StoreFinderGetDirectionsButton from './StoreFinderGetDirectionsButton';

const styles = {
  headerWrappper: css({
    display: 'flex',
  }),
  headerIcon: css({
    color: 'var(--color-primary)',
    fontSize: '24px',
  }),
  header: css({
    color: 'var(--color-primary)',
    fontWeight: '600',
    fontSize: '20px',
  }),
  locationName: css({
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
  }),
  locationRow: css({
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  }),
  locationColumn: css({
    flex: 1,
    minWidth: '200px',
  }),
  storeHoursColumn: css({
    flex: 1,
    minWidth: '250px',
    maxWidth: '400px',
  }),
  storeHours: css({
    fontSize: '20px',
    fontWeight: '600',
  }),
  storeHoursLine: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  storeHoursWeekday: css({
    textAlign: 'left',
  }),
  bold: css({
    fontWeight: '600',
  }),
  storeHoursOpeningTime: css({
    textAlign: 'right',
  }),
  getDirections: css({
    margin: '8px 0px',
  }),
  phone: css({
    fontWeight: '600',
  }),
  phoneNumber: css({
    textDecoration: 'underline',
  }),
};

/**
 * Store details component.
  * @returns {JSX}
  */
const StoreDetails = () => {
  const dispatch = useDispatch();
  const preferredLocation = useSelector(getPreferredLocation);
  const route = useSelector(getCurrentRoute);
  const getRouteLocation = makeGetLocation(() => route.params.code);
  const routeLocation = useSelector(getRouteLocation);

  const storesEqual = preferredLocation
    && routeLocation
    && preferredLocation.code === routeLocation.code;

  if (!routeLocation) {
    return null;
  }

  const { address, operationHours } = routeLocation;

  /**
  * Formats the store name for the header.
  * @param {Object} location The location object.
  * @returns {string}
  * */
  const formatStoreName = (location) => {
    const { name, address: locationAddress = {} } = location;
    const { region } = locationAddress;
    const string = name + (region ? `, ${region}` : '');
    return string;
  };

  const currentDay = moment().format('ddd').toLowerCase();

  return (
    <div>
      <Button
        onClick={() => dispatch(selectLocation(routeLocation, true))}
        role="button"
        type="plain"
        className={classNames(styles.headerWrappper)}
        wrapContent={false}
      >
        <div className={styles.headerIcon}>
          <LocationIcon className={styles.icon} />
        </div>
        <div className={styles.header}>
          {storesEqual ?
            i18n.text('location.myStore') :
            i18n.text('location.makeMyStore')
          }
        </div>
      </Button>

      <div className={styles.locationName}>
        {formatStoreName(routeLocation)}
      </div>

      <div className={styles.locationRow}>
        <div className={styles.locationColumn}>
          <div>
            {address.street}
          </div>
          <div>
            {`${address.city}, ${address.postalCode}`}
          </div>
          <StoreFinderGetDirectionsButton address={address} />
          <div className={styles.phone}>
            {`${i18n.text('location.phone')}: `}
          </div>
          <div className={styles.phoneNumber}>
            <Link
              href={`tel:${address.phoneNumber}`}
              className={classNames(styles.phoneNumber)}
              target="_blank"
            >
              {address.phoneNumber}
            </Link>
          </div>
        </div>
        <div className={styles.storeHoursColumn}>
          <div className={styles.storeHours}>
            {`${i18n.text('location.storeHours')}:`}
          </div>
          {getWeekDaysOrder().map((weekDay) => {
            if (!operationHours[weekDay]) {
              return null;
            }
            return (
              <div className={styles.storeHoursLine} key={weekDay}>
                <div className={classNames(styles.storeHoursWeekday, {
                  [styles.bold]: weekDay === currentDay,
                })}
                >
                  {`${i18n.text(`locations.${weekDay}`)}:`}
                </div>
                <div className={classNames(styles.storeHoursOpeningTime, {
                  [styles.bold]: weekDay === currentDay,
                })}
                >
                  {operationHours[weekDay]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
