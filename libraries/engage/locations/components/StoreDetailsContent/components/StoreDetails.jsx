import React from 'react';
import { css } from 'glamor';
import { LocationIcon } from '@shopgate/engage/components';
import { connect } from 'react-redux';
import { getPreferredLocation } from '@shopgate/engage/locations/selectors';
import { i18n, getWeekDaysOrder } from '@shopgate/engage/core';
import PropTypes from 'prop-types';

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
    fontSize: '25px',
    fontWeight: '600',
  }),
  locationRow: css({
    display: 'flex',
  }),
  locationColumn: css({
    flex: 1,
  }),
  storeHours: css({
    fontSize: '16px',
    fontWeight: '600',
  }),
  storeHoursLine: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  storeHoursWeekday: css({
    fontSize: '12px',
  }),
  storeHoursOpeningTime: css({
    fontSize: '12px',
  }),
};

/**
 * @param {Object} state .
 * @returns {Object}
 */
const mapStateToProps = state => ({
  preferredLocation: getPreferredLocation(state),
});

/**
 * Store details component.
 * @param {Object} props The component props.
  * @returns {JSX}
  */
const StoreDetails = (props) => {
  const { preferredLocation } = props;
  const { name: locationName, address, operationHours } = preferredLocation;

  return (
    <div>
      <div className={styles.headerWrappper}>
        <div className={styles.headerIcon}>
          <LocationIcon className={styles.icon} />
        </div>
        <div className={styles.header}>My Store</div>
      </div>

      <div className={styles.locationName}>{locationName}</div>

      <div className={styles.locationRow}>
        <div className={styles.locationColumn}>
          <div>
            {address.street}
          </div>
          <div>
            {`${address.city} ${address.postalCode}`}
          </div>
          <div>
                        Get Directions
          </div>
          <div>
                        Phone:
          </div>
          <div>
            {address.phoneNumber}
          </div>
        </div>
        <div className={styles.locationColumn}>
          <div className={styles.storeHours}>
                        Store Hours: I18n
          </div>
          {getWeekDaysOrder().map((weekDay) => {
            if (!operationHours[weekDay]) {
              return null;
            }
            return (

              <div className={styles.storeHoursLine} key={weekDay}>
                <div className={styles.storeHoursWeekday}>
                  {i18n.text(`locations.${weekDay}`)}
                </div>
                <div className={styles.storeHoursOpeningTime}>{operationHours[weekDay]}</div>
              </div>

            );
          })}
        </div>
      </div>
    </div>
  );
};

StoreDetails.propTypes = {
  preferredLocation: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      postalCode: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
    operationHours: PropTypes.shape(),
  }),
};

StoreDetails.defaultProps = {
  preferredLocation: null,
};

export default connect(mapStateToProps)(StoreDetails);
