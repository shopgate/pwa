import React from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The Discounts component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const DiscountAmount = ({ currency, isDisabled, value }) => (
  <div className={`${styles.discountsValue} ${isDisabled ? styles.disabled : ''}`}>
    <span>-</span>
    <I18n.Price price={value} currency={currency} />
  </div>
);

DiscountAmount.propTypes = {
  currency: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  value: PropTypes.number,
};

DiscountAmount.defaultProps = {
  value: null,
};

export default connect(props => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <DiscountAmount {...props} isDisabled={isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
));
