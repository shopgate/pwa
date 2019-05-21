import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_AVAILABILITY,
  PRODUCT_AVAILABILITY_AFTER,
  PRODUCT_AVAILABILITY_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
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

export default connect(memo(Availability, isEqual));
