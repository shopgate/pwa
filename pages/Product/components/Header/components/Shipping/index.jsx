import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_SHIPPING,
  PRODUCT_SHIPPING_AFTER,
  PRODUCT_SHIPPING_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
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
  <Fragment>
    <Portal name={PRODUCT_SHIPPING_BEFORE} />
    <Portal name={PRODUCT_SHIPPING}>
      <PlaceholderLabel className={styles.placeholder} ready={(shipping !== null)}>
        {shipping && typeof shipping.price !== 'undefined' && shipping.price !== null && (
          <Label className={styles.shipping} price={shipping.price} currency={shipping.currency} />
        )}
      </PlaceholderLabel>
    </Portal>
    <Portal name={PRODUCT_SHIPPING_AFTER} />
  </Fragment>
);

Shipping.propTypes = {
  shipping: PropTypes.shape(),
};

Shipping.defaultProps = {
  shipping: null,
};

export default connect(memo(Shipping));
