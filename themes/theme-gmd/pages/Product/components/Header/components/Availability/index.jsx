import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { Portal, Availablity as AvailableText, PlaceholderLabel } from '@shopgate/engage/components';
import {
  PRODUCT_AVAILABILITY,
  PRODUCT_AVAILABILITY_AFTER,
  PRODUCT_AVAILABILITY_BEFORE,
} from '@shopgate/engage/product';
import connect from './connector';
import styles from './style';

/**
 * The Availability component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Availability = ({ availability }) => (
  <Fragment>
    <Portal name={PRODUCT_AVAILABILITY_BEFORE} />
    <Portal name={PRODUCT_AVAILABILITY}>
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
    </Portal>
    <Portal name={PRODUCT_AVAILABILITY_AFTER} />
  </Fragment>
);

Availability.propTypes = {
  availability: PropTypes.shape(),
};

Availability.defaultProps = {
  availability: null,
};

export default connect(pure(Availability));
