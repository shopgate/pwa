import React from 'react';
import PropTypes from 'prop-types';
import Availability from '@shopgate/pwa-ui-shared/Availability';
import connect from './connector';
import styles from './style';

/**
 * The VariantAvailability component.
 * @return {JSX}
 */
const VariantAvailability = ({ availability }) => (
  <Availability
    className={styles}
    state={availability.state}
    text={availability.text}
  />
);

VariantAvailability.propTypes = {
  availability: PropTypes.shape(),
};

VariantAvailability.defaultProps = {
  availability: null,
};

export default connect(VariantAvailability);
