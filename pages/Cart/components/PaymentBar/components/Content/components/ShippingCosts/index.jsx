import React from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The ShippingCosts component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ShippingCosts = ({ currency, isDisabled, value }) => {
  if (value === null) {
    return (
      <div className={styles.shippingInfoValue} data-test-id="noShippingPrice">&nbsp;</div>
    );
  }

  return (
    <div className={`${styles.shippingInfoValue} ${isDisabled ? styles.disabled : ''}`}>
      {!value && <I18n.Text string="shipping.free_short" />}
      {!!value && <I18n.Price price={value} currency={currency} />}
    </div>
  );
};

ShippingCosts.propTypes = {
  currency: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  value: PropTypes.number,
};

ShippingCosts.defaultProps = {
  value: null,
};

export default connect(props => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <ShippingCosts {...props} isDisabled={isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
));
