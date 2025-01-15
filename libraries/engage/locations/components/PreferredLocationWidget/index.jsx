import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { getPreferredLocation } from '@shopgate/engage/locations/selectors';
import moment from 'moment';
import {
  LocationIcon,
  Link,
} from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { i18n } from '@shopgate/engage/core';
import { STORE_DETAILS_PATH } from '../../constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  preferredLocation: getPreferredLocation(state, props),
});

const styles = {
  icon: css({
    color: 'var(--color-primary)',
  }),
  locationName: css({
    color: 'var(--color-primary)',
    fontWeight: '600',
    textDecoration: 'underline',
  }),
  locationNameWrapper: css({
    display: 'flex',
  }),
  locationRow: css({
    justifyContent: 'space-between',
    display: 'flex',
    margin: '12px',
    border: `1px solid ${themeConfig.colors.shade7}`,
    padding: '6px',
  }),
};

/**
 * Shows the preferred location in an widget on the home page.
 * @param {Object} props props
 * @param {Object} props.preferredLocation preferredLocation
 * @return {JSX.Element}
 */
const PreferredLocationWidget = ({
  preferredLocation,
}) => {
  const { name, operationHours } = preferredLocation || {};
  const operatingDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const currentDay = operatingDays[moment().day() - 1];
  const operatingHour = operationHours && operationHours[currentDay];
  // sasa todo show "openUntil" instead of operatingHour

  return (
    <>
      <Link
        href={`${STORE_DETAILS_PATH}/${preferredLocation.code}`}
      >
        <div className={styles.locationRow}>
          <div className={styles.locationNameWrapper}>
            <div className={styles.icon}>
              <LocationIcon size={24} />
            </div>
            <div className={styles.locationName}>{name}</div>
          </div>
          <div className={styles.operatingHourWrapper}>
            <div className={styles.operatingHour}>
              { `${i18n.text('location.open')} ${operatingHour}`}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

PreferredLocationWidget.propTypes = {
  preferredLocation: PropTypes.shape(),
};

PreferredLocationWidget.defaultProps = {
  preferredLocation: null,
};

export default connect(mapStateToProps)(PreferredLocationWidget);
