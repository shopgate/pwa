import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import AvailableText from '@shopgate/pwa-ui-shared/Availability';
import connect from './connector';
import styles from './style';

/**
 * The Availability component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Availability = ({ availability }) => (
  <PlaceholderLabel className={styles.placeholder} ready={(availability !== null)}>
    {availability && (
      <AvailableText
        className={styles.availability}
        showWhenAvailable
        text={availability.text}
        state={availability.state}
      />
    )}
  </PlaceholderLabel>
);

Availability.propTypes = {
  availability: PropTypes.shape(),
};

Availability.defaultProps = {
  availability: null,
};

export default connect(Availability);
