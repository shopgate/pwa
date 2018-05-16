import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import Label from './components/Label';
import connect from './connector';
import styles from './style';

/**
 * The Shipping Info component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Shipping = ({ shipping }) => (
  <PlaceholderLabel className={styles.placeholder} ready={(shipping !== null)}>
    {shipping && shipping.price !== null && (
      <Label className={styles.shipping} price={shipping.price} currency={shipping.currency} />
    )}
  </PlaceholderLabel>
);

Shipping.propTypes = {
  shipping: PropTypes.shape(),
};

Shipping.defaultProps = {
  shipping: null,
};

export default connect(Shipping);
