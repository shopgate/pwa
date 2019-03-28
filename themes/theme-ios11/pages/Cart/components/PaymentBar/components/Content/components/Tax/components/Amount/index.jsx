import React from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The TaxAmount component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const TaxAmount = ({ currency, isDisabled, value }) => (
  <div className={`${styles.taxValue} ${isDisabled ? styles.disabled : ''}`}>
    <I18n.Price price={value} currency={currency} />
  </div>
);

TaxAmount.propTypes = {
  currency: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  value: PropTypes.number,
};

TaxAmount.defaultProps = {
  value: null,
};

export default connect(props => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <TaxAmount {...props} isDisabled={isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
));
