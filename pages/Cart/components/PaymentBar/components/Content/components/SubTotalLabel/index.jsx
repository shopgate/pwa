import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import styles from './style';

/**
 * The SubTotalLabel component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const SubTotalLabel = ({ isDisabled }) => (
  <div className={`${isDisabled ? styles : ''}`}>
    <I18n.Text string="cart.subtotal" />:
  </div>
);

SubTotalLabel.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
};

export default () => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <SubTotalLabel isDisabled={isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
);
