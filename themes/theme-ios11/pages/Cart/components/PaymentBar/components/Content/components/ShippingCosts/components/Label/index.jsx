import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import CartContext from 'Pages/Cart/context';
import styles from './style';
import connect from './connector';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const ShippingCostsLabel = ({ isDisabled, shipping }) => (
  <div className={`${styles.shippingInfo} ${isDisabled ? styles.disabled : ''}`} data-test-id="shippingLabel">
    <CartContext.Consumer>
      {({ shipping: { unavailable } }) => {
        if (shipping === null && unavailable) {
          return <span>{unavailable}</span>;
        }

        return (
          <React.Fragment>
            <I18n.Text string={shipping === null ? 'shipping.unknown' : 'titles.shipping'} />
            {shipping !== null ? ':' : ''}
          </React.Fragment>
        );
      }}
    </CartContext.Consumer>
  </div>
);

ShippingCostsLabel.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  shipping: PropTypes.number,
};

ShippingCostsLabel.defaultProps = {
  shipping: null,
};

export default connect(props => (
  <LoadingContext.Consumer>
    {({ isLoading }) => (
      <ShippingCostsLabel {...props} isDisabled={isLoading(CART_PATH)} />
    )}
  </LoadingContext.Consumer>
));
