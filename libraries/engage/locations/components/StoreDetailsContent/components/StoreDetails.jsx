import React from 'react';
import { css } from 'glamor';
import { LocationIcon, Button, Link } from '@shopgate/engage/components';
import { connect } from 'react-redux';
import { getPreferredLocation, makeGetLocation } from '@shopgate/engage/locations/selectors';
import {
  i18n, getWeekDaysOrder, getCurrentRoute,
} from '@shopgate/engage/core';
import PropTypes from 'prop-types';
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
    minWidth: '300px',
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
 * @param {Object} state .
 * @returns {Object}
 */
const mapStateToProps = (state) => {
  const route = getCurrentRoute(state);
  const getRouteLocation = makeGetLocation(() => route.params.code);
  return ({
    preferredLocation: getPreferredLocation(state),
    routeLocation: getRouteLocation(state),
  });
};

/**
 * Maps dispatch to props
 * @param {Function} dispatch Dispatch
 * @returns {Object}
 * */
const mapDispatchToProps = dispatch => ({
  setLocation: location => dispatch(selectLocation(location, true)),
});

/**
 * Store details component.
 * @param {Object} props The component props.
  * @returns {JSX}
  */
const StoreDetails = (props) => {
  const { preferredLocation, routeLocation, setLocation } = props;
  const storesEqual = preferredLocation
    && routeLocation
    && preferredLocation.code === routeLocation.code;

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
  // sasa todo test phone number in app
  // sasa todo test direction in app

  return (
    <div>
      <Button
        onClick={() => setLocation(routeLocation)}
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
        <div className={styles.locationColumn}>
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

StoreDetails.propTypes = {
  routeLocation: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      postalCode: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
    operationHours: PropTypes.shape(),
  }).isRequired,
  setLocation: PropTypes.func.isRequired,
  preferredLocation: PropTypes.shape({
    code: PropTypes.string,
  }),
};

StoreDetails.defaultProps = {
  preferredLocation: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreDetails);
