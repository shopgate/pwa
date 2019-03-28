import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import styles from './style';

/**
 * The Total component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const TotalLabel = ({ isDisabled }) => (
  <div className={`${styles.totalBase} ${isDisabled ? styles.disabled : ''}`}>
    <I18n.Text string="cart.total" />:
  </div>
);

TotalLabel.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
};

export default () => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <TotalLabel isDisabled={isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
);
