import React, { useContext, useMemo } from 'react';
import { css } from 'glamor';
import {
  LocationIcon, Button, Link, ConditionalWrapper,
} from '@shopgate/engage/components';
import {
  getWeekDaysOrder,
} from '@shopgate/engage/core';
import { i18n } from '@shopgate/engage/core/helpers';
import classNames from 'classnames';
import moment from 'moment';
import { StoreDetailsContext } from '../../../providers/StoreDetailsContext';
import GetDirectionsButton from './GetDirectionsButton';

const styles = {
  headerWrapper: css({
    display: 'flex',
  }),
  headerIcon: css({
    color: 'var(--color-primary)',
    fontSize: 20,
    alignContent: 'center',
    marginRight: 4,
  }),
  header: css({
    color: 'var(--color-primary)',
    fontWeight: '600',
    fontSize: 20,
  }),
  locationName: css({
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  }),
  locationRow: css({
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  }),
  locationColumn: css({
    flex: 1,
    minWidth: '200px',
    '& > p': {
      margin: 0,
    },
  }),
  storeHoursColumn: css({
    flex: 1,
    minWidth: '250px',
    maxWidth: '455px',
  }),
  storeHours: css({
    fontSize: 17,
    fontWeight: '600',
  }),
  storeHoursLine: css({ }),
  storeHoursWeekday: css({
    textAlign: 'left',
  }),
  bold: css({
    fontWeight: '600',
  }),
  storeHoursOpeningTime: css({
    textAlign: 'right',
  }),
  phone: css({
    fontSize: 17,
    fontWeight: '600',
  }),
  phoneNumber: css({
    textDecoration: 'underline',
  }),
  makeMyStoreButton: css({
    color: 'var(--color-primary)',
  }),
  comingSoon: css({
    fontStyle: 'italic',
  }),
  buttonRow: css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px 30px',
    flexWrap: 'wrap',
    margin: '8px 0',
  }),
};

/**
 * Store details component.
  * @returns {JSX}
  */
const StoreDetails = () => {
  const {
    selectLocation,
    routeLocation,
    isRouteLocationPreferred,
  } = useContext(StoreDetailsContext);

  const {
    address = {},
    operationHours = {},
    isComingSoon,
  } = routeLocation || {};
  const currentDay = moment().format('ddd').toLowerCase();

  // Check if there are any opening hours to hide the section if not
  const hasOpeningHours = useMemo(() =>
    Object.keys(operationHours).length > 0 &&
    Object.values(operationHours).some(value => value && typeof value === 'string' && value.length > 0),
  [operationHours]);

  if (!routeLocation) {
    return null;
  }

  return (
    <div>
      <ConditionalWrapper
        condition={!isRouteLocationPreferred}
        wrapper={children => (
          <Button
            onClick={() => selectLocation(routeLocation, true)}
            role="button"
            type="plain"
          >
            {children}
          </Button>
        )}
      >
        <div className={styles.headerWrapper}>
          <div className={styles.headerIcon}>
            <LocationIcon className={styles.icon} size={20} />
          </div>
          <div className={styles.header}>
            {isRouteLocationPreferred ?
              i18n.text('location.myStore') :
              i18n.text('location.makeMyStore')
          }
          </div>
        </div>
      </ConditionalWrapper>
      <div className={styles.locationName}>
        {routeLocation.name}
      </div>
      <div className={styles.locationRow}>
        <div className={styles.locationColumn}>
          <p>
            {address?.street}
          </p>
          {address?.street2 && address.street2 !== '' && (
            <p>
              {address.street2}
            </p>
          )}
          {address?.street3 && address.street3 !== '' && (
            <p>
              {address.street3}
            </p>
          )}
          {address?.street4 && address.street4 !== '' && (
            <p>
              {address.street4}
            </p>
          )}
          <p>
            {i18n.text('locations.address', address)}
          </p>

          <div className={styles.buttonRow}>
            <GetDirectionsButton address={address} />
            { (!isComingSoon && !isRouteLocationPreferred) &&
            <Button
              onClick={() => selectLocation(routeLocation, true)}
              role="button"
              type="plain"
              className={classNames(styles.makeMyStoreButton)}
            >
              <span>
                {i18n.text('location.makeMyStore')}
              </span>
            </Button>
            }
            {isComingSoon && (
            <div className={styles.comingSoon}>
              {i18n.text('location.comingSoon')}
            </div>
            )}

          </div>
          {address?.phoneNumber && (
            <>
              <div className={styles.phone}>
                {`${i18n.text('location.phone')}: `}
              </div>

              <div className={styles.phoneNumber}>
                <Link
                  href={`tel:${address.phoneNumber}`}
                  className={classNames(styles.phoneNumber)}
                  target="_blank"
                  role="button"
                  aria-label={address.phoneNumber}
                >
                  {address.phoneNumber}
                </Link>
              </div>
            </>
          )}
        </div>
        {hasOpeningHours && (
        <div className={styles.storeHoursColumn}>
          <div className={styles.storeHours}>
            {`${i18n.text('location.storeHours')}:`}
          </div>
          <table>
            <tbody>
              {getWeekDaysOrder().map((weekDay) => {
                if (!operationHours[weekDay]) {
                  return null;
                }
                return (
                  <tr
                    className={styles.storeHoursLine}
                    key={weekDay}
                    aria-label={
                    `${i18n.text(`locations.${weekDay}`)}: ${operationHours[weekDay]}`
                    }
                    tabIndex={0}
                  >
                    <td
                      className={classNames(styles.storeHoursWeekday, {
                        [styles.bold]: weekDay === currentDay,
                      })}
                      aria-hidden
                    >
                      {`${i18n.text(`locations.${weekDay}`)}:`}
                    </td>
                    <td
                      className={classNames(styles.storeHoursOpeningTime, {
                        [styles.bold]: weekDay === currentDay,
                      })}
                      aria-hidden
                    >
                      {operationHours[weekDay]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetails;
