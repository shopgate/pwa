import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_CHECKOUT_BUTTON,
  CART_CHECKOUT_BUTTON_AFTER,
  CART_CHECKOUT_BUTTON_BEFORE,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import CartContext from 'Pages/Cart/context';
import connect from './connector';
import styles from './style';

/**
 * The checkout button component.
 * @param {boolean} isActive Should the button shown as active.
 * @return {JSX}
 */
const CheckoutButton = ({ isOrderable }) => (
  <CartContext.Consumer>
    {({ isLoading }) => {
      const isActive = isOrderable && !isLoading;
      return (
        <Fragment>
          <Portal name={CART_CHECKOUT_BUTTON_BEFORE} props={{ isActive }} />
          <Portal name={CART_CHECKOUT_BUTTON} props={{ isActive }}>
            <Link href={CHECKOUT_PATH} disabled={!isActive}>
              <RippleButton
                disabled={!isActive}
                type="regular"
                className={isActive ? styles.button : styles.disabledButton}
              >
                <I18n.Text string="cart.checkout" />
              </RippleButton>
            </Link>
          </Portal>
          <Portal name={CART_CHECKOUT_BUTTON_AFTER} props={{ isActive }} />
        </Fragment>
      );
    }}
  </CartContext.Consumer>
);
CheckoutButton.propTypes = {
  isOrderable: PropTypes.bool,
};

CheckoutButton.defaultProps = {
  isOrderable: true,
};

export default connect(CheckoutButton);
