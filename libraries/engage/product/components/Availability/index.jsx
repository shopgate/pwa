import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
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
const Availability = ({ availability, fulfillmentMethods, fulfillmentSelection }) => (
  <Fragment>
    { /* Render only when no fulfillment methods are available or when the given method exists */ }
    {(!fulfillmentMethods || fulfillmentMethods.indexOf(fulfillmentSelection) !== -1) &&
      <Fragment>
        <Portal name={PRODUCT_AVAILABILITY_BEFORE} />
        <Portal name={PRODUCT_AVAILABILITY}>
          <PlaceholderLabel className={styles.placeholder} ready={(availability !== null)}>
            { availability && (
              <AvailableText
                className={styles.availability}
                showWhenAvailable
                text={availability.text}
                state={availability.state}
              />
            ) }
          </PlaceholderLabel>
        </Portal>
        <Portal name={PRODUCT_AVAILABILITY_AFTER} />
      </Fragment>
    }
  </Fragment>
);

Availability.propTypes = {
  availability: PropTypes.shape(),
  fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  fulfillmentSelection: PropTypes.string,
};

Availability.defaultProps = {
  availability: null,
  fulfillmentMethods: null,
  fulfillmentSelection: '',
};

export default connect(pure(Availability));
