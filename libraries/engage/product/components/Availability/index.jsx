import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import {
  SurroundPortals,
  PlaceholderLabel,
  Availability as AvailableText,
} from '@shopgate/engage/components';
import { PRODUCT_AVAILABILITY } from '@shopgate/engage/product';
import connect from './connector';
import styles from './style';

/**
 * The Availability component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Availability = ({ availability, fulfillmentMethods, fulfillmentSelection }) => {
  // Render only when no fulfillment methods are available or when the given method exists
  if (!fulfillmentMethods || fulfillmentMethods.indexOf(fulfillmentSelection) !== -1) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_AVAILABILITY} portalProps={{ availability }}>
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
    </SurroundPortals>
  );
};

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
